const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const cors = require('cors');
const app = express()
app.use(express.json())
app.use(cors());
const {v4:uuidv4} = require("uuid");

const path = require('path')
const dbpath = path.join(__dirname, 'database.db')
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is Running at http//localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()
//Getting All recpies
app.get("/recpies/",async (request,response)=>{
    const getAllrecpies = `SELECT * FROM recpies`
    const getrecpieAPI = await db.all(getAllrecpies)
    response.send(getrecpieAPI)
})

//Adding New recpie
app.post("/recpies/",async (request,response)=>{
    const newUUID = uuidv4()
    const currentDate = new Date().toISOString();
    const {Title,Ingredients,Instructions,Category,CookingTime} = request.body
    const ingredientsJson = JSON.stringify(Ingredients);
    const addingnewrecpieQuery = `INSERT INTO recpies(id,Title,Ingredients,Instructions,Category,CookingTime,CreatedDate) VALUES (?, ?, ?, ?, ?, ?, ?) `
    await db.run(addingnewrecpieQuery, [newUUID, Title, ingredientsJson, Instructions, Category, CookingTime, currentDate]);
    response.send("Recpie Added successfully");
})

//Deleting Specific recpie
app.delete("/recpies/:id/",async (request,response)=>{
  const {id} = request.params
  const deleteSpecificRecpieQuery = `DELETE FROM recpies WHERE id=${id}`
  await db.run(deleteSpecificRecpieQuery)
  response.send("Recpie Deleted Successfully")
})
module.exports=app