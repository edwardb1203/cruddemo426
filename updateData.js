import inquirer from "inquirer";
import fs from "fs";
import queryDB from "./queryDB.js";
import dbFileCheck from "./dbFileCheck.js";

export default async function updateData(info) {

// to terminate an operation if the database has not been created.
  dbFileCheck();

  try {

    // The first thing is to collect the user ID with this code:
    const answers = await inquirer.prompt([
        {
          type: "input",
          name: "recordID",
          message: "Enter Record ID",
        },
      ]);

      // The second is to search for the user:
      // The code below searches through the users (info) and sets the user found to the current variable.
      // Finally, the updateDetails is called to collect the updated information and overwrite the database with the new data.
      let current;

      info.forEach((element) => {
        if (element.id === answers.recordID) {
          current = element;
  
          updateDetails(current, info);
        }
      });
    
  } catch (error) {
    console.log("Something went wrong!", error);
  }
}

// The default key is new. 
// It holds input that will be used if the user doesn’t provide one. 
// It keeps track of the user’s current data for this code. 
// So the user can hit the Enter button instead of entering the former value again.

async function updateDetails(current, info) {
    try {
        const feedbacks = await inquirer.prompt([
            {
              type: "input",
              default: current.name,
              name: "name",
              message: "What's your name?",
            },
            {
              type: "number",
              default: current.phone,
              name: "phone",
              message: "What's your phone?",
            },
            {
              type: "list",
              default: current.age,
              name: "age",
              message: "Are an adult?",
              choices: [
                { name: "Y", value: "Adult" },
                { name: "N", value: "Minor" },
              ],
            },
          ]);

          current.name = feedbacks.name;
          current.phone = feedbacks.phone;
          current.age = feedbacks.age;

          await fs.writeFile("db.json", JSON.stringify(info), function (err) {
            if (err) {
              console.log(err);
            }
            console.log("updated");
          });

    } catch (error) {
      console.log("Something went wrong!", error);
    }
  }

  queryDB(updateData)