import { spawn } from 'child_process';
import fs from "fs";
import { type } from 'os';

export const executeScript = (path, args = [], onStream = () => {}) => {

   // const process = spawn("bash", [path]);

   return new Promise((resolve, reject) => {
      if(!fs.existsSync(path)){
         return reject({success : false, error : "Script not found"});
      }

      let out = "" , err = "";

      process.stdout.on("data", (data) => {
         const text = data.toString();
         out += text;
         onStream({type : "stdout", message : text});
      });

      process.stderr.on("data", (data) => {
         const text = data.toString();
         err += text;
         onStream({type : "stderr", message : text});
      });

      process.on("close", (code) => {
         if(code == 0){
            return resolve({ success: true, output: out });
         }
         return reject({ success: false, output: out, error: err, code });
      });

      child.on("error", (error) => {
         reject({ success: false, error });
      });
   })
};