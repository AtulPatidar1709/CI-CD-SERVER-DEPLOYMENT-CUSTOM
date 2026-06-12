import chalk from "chalk";

import { executeScript } from "./executeScript";

export const deploy = async ((service, script, needInstall, { commitMessage, commitAuthor }) => {
   console.log(
      chalk.yellow.bold(
         `\n${
            service.charAt(0).toUpperCase() + service.slice(1)
         } changed -> Deploying ${service}...`
      )
   );

   try {
      const {success} = await executeScript(script, [needInstall], logStream(service));

      if (success) {
         console.log(chalk.green.bold("✓ Deployment completed!\n"));
         await notifyOnSuccess({ service, commitMessage, commitAuthor });
      }

   } catch (error) {
      console.error(chalk.red.bold('X Deployment failed!\n'));
      await notifyOnSuccess({ 
         service, 
         error : err.error || "Unknown error",
         code : err.code, 
         commitMessage, 
         commitAuthor 
      });
   }
});
