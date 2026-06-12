import chalk from "chalk";

import { executeScript } from "./executeScript";

export const deploy = async ((service, script) => {
   console.log(
      chalk.yellow.bold(
         `\n${
            service.charAt(0).toUpperCase() + service.slice(1)
         } changed -> Deploying ${service}...`
      )
   );

   try {
      const {success} = await executeScript(script, [], logStream(service));

      if (success) {
         console.log(chalk.green.bold("✓ Deployment completed!\n"));
      }

   } catch (error) {
      console.error(chalk.red.bold('X Deployment failed!\n'));
   }
});
