import express from "express";
import { verifySignature } from "./middlewares/verifySignature";
import { executeScript } from "./utils/executeScript";
import chalk from "chalk";
import { deploy } from "./utils/deploy";

const app = express();
app.use(express.json());

app.post("/webhook/tigger-deployment", verifySignature, async (req, res) => {
   res.status(200).send("OK");

   const commits = req.body.commits;

   const commitMessage =
    req.body.head_commit?.message || "No commit message found";
  const commitAuthor = req.body.head_commit?.author?.name || "Unknown";

   let clientChanged = false;
   let serverChanged = false;

   for(const commit of commits) {
      const files = [...commit.added, ...commit.modified, ...commit.removed];

      for(const file of files){
         if(file.startsWith("Client/")) clientChanged = true;
         if(file.startsWith("Server/")) serverChanged = true;
         if(clientChanged && serverChanged ) break;
      }

      if(clientChanged && serverChanged) break;
   }

   if(!clientChanged && !serverChanged) {
      console.log(chalk.gray("No Deployable changed detected."));
      return;
   }

   if (clientChanged) {
      await deploy("client", "deploy-client.sh", { commitMessage, commitAuthor });
  }

  if (serverChanged) {
      await deploy("server", "deploy-server.sh", { commitMessage, commitAuthor });
  }
});

app.listen(PORT, () => console.log(`CI/CD Server is running on PORT ${PORT}`));