import 'dotenv/config'; 
import chalk from "chalk";
import express from "express";
import { deploy } from "./utils/deploy";
import { executeScript } from "./utils/executeScript";
import { verifySignature } from "./middlewares/verifySignature";

const app = express();
app.use(express.json());

app.get("/health", (_, res) => {
  res.status(200).json({
    status: "OK",
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.post("/webhook/tigger-deployment", verifySignature, async (req, res) => {
   res.status(200).send("OK");

   const commits = req.body.commits;

   const commitMessage =
    req.body.head_commit?.message || "No commit message found";
  const commitAuthor = req.body.head_commit?.author?.name || "Unknown";

   let clientChanged = false;
   let serverChanged = false;

   let clientDepsChanged = false;
   let serverDepsChanged = false;

   for(const commit of commits) {
      const files = [...commit.added, ...commit.modified, ...commit.removed];

      for(const file of files){
         if(file.startsWith("Client/")) clientChanged = true;
         if(file.startsWith("Server/")) serverChanged = true;

         if (file === "Client/package.json" || file === "Client/package-lock.json") {
            clientDepsChanged = true;
         }

         if (file === "Server/package.json" || file === "Server/package-lock.json") {
            serverDepsChanged = true;
         }

         if(clientChanged && serverChanged ) break;

      }

      if(clientChanged && serverChanged) break;
   }

   if(!clientChanged && !serverChanged) {
      console.log(chalk.gray("No Deployable changed detected."));
      return;
   }

   if (clientChanged) {
      await deploy("client", "deploy-client.sh", needInstall, { commitMessage, commitAuthor });
  }

  if (serverChanged) {
      await deploy("server", "deploy-server.sh", needInstall, { commitMessage, commitAuthor });
  }
});

app.listen(PORT, () => console.log(`CI/CD Server is running on PORT ${PORT}`));