const express = require('express');
const oracledb = require('oracledb');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedUsers = [
  {
    username: 'AD1',
    password: 'AD1',
    schema: 'schema1'
  },
  {
    username: 'N1',
    password: 'N1',
    schema: 'schema2'
  }
];

app.get('/', (req, res) => {
  res.send(`
   <head><style>
   form {
     display: flex;
     flex-direction: column;
     align-items: center;
     padding: 20px;
   }
   input[type="text"],
   input[type="password"] {
     width: 200px;
     height: 40px;
     margin-bottom: 20px;
     padding-left: 10px;
     font-size: 16px;
     border: 1px solid gray;
     border-radius: 5px;
   }
   button[type="submit"] {
     width: 200px;
     height: 40px;
     background-color: blue;
     color: white;
     font-size: 16px;
     border: none;
     border-radius: 5px;
     cursor: pointer;
   }
 </style>
 </head>
    <form action="/login" method="post">
      <input type="text" name="username" placeholder="Username">
      <input type="password" name="password" placeholder="Password">
      <button type="submit">Submit</button>
    </form>
  `);
});



app.post('/login', async (req, res) => {
  let connection;
  const { username, password } = req.body;
  
  const user = allowedUsers.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.send('Login Failed');
  }
  if (username === 'AD1') {
    res.redirect('/admin');
  } else {
    res.redirect('/normal');
  }

  const log = `[${new Date().toString()}] User ${username} logged in\n`;
  fs.appendFile('journalisation.txt', log, (err) => {
    if (err) throw err;
    console.log('The log was saved!');
  });
});

    app.get('/admin', async(req, res) => {
      let connection;
      try {
         connection = await oracledb.getConnection({
          user: "AD1",
          password: "AD1",
          connectString: "localhost/orcl"
        });
              const sqlQueries = [ "select * from projet.customer",  "select * from projet.car"];
                       // const sqlQueries = [  "select * from projet.car"];
    const tables = [];
    for (const sql of sqlQueries) {
      const result = await connection.execute(sql);
      const tableHTML = result.rows.map(row => {
        let rowHTML = '';
        for (let i = 0; i < result.metaData.length; i++) {
          rowHTML += `<td>${row[i]}</td>`;
        }
        return `<tr>${rowHTML}</tr>`;
      }).join('');
      tables.push({ metaData: result.metaData, tableHTML });
    }
    res.send(`
    <form action="/logout" method="post"> 
    <button type="submit">logout</button>
  </form>
      <head><style>
      table {
        width: 80%;
        margin: 20px auto;
        border-collapse: collapse;
      }
    
      th, td {
        border: 1px solid gray;
        padding: 10px;
        text-align: left;
      }
    
      th {
        background-color: lightgray;
        font-weight: bold;
      }
    
      tr:nth-child(even) {
        background-color: lightgray;
      }
    </style>
    </head>
      <h1>Tables</h1>
      ${tables.map(table => `
        <table>
          <thead>
            <tr>
              ${table.metaData.map(col => `<th>${col.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${table.tableHTML}
          </tbody>
        </table>
        
      `).join('')}
    `);
          } catch (error) {
            console.error(error);
            res.send('Error Occurred');
          } finally {
          }
    });


    app.get('/normal', async(req, res) => {
      let connection;
      try {
         connection = await oracledb.getConnection({
          user: 'N1',
          password: 'N1',
          connectString: "localhost/orcl"
        });
       
              //const sqlQueries = [  "select * from projet.customer",  "select * from projet.car"];
                        const sqlQueries = [  "select * from projet.car" ];
    
    
    const tables = [];
    for (const sql of sqlQueries) {
      const result = await connection.execute(sql);
      const tableHTML = result.rows.map(row => {
        let rowHTML = '';
        for (let i = 0; i < result.metaData.length; i++) {
          rowHTML += `<td>${row[i]}</td>`;
        }
        return `<tr>${rowHTML}</tr>`;
      }).join('');
      tables.push({ metaData: result.metaData, tableHTML });
    }
    
    res.send(`<form action="/logout" method="post">
     
    <button type="submit">logout</button>
  </form>
  <head><style>
      table {
        width: 80%;
        margin: 20px auto;
        border-collapse: collapse;
      }
    
      th, td {
        border: 1px solid gray;
        padding: 10px;
        text-align: left;
      }
      
      th {
        background-color: lightgray;
        font-weight: bold;
      }
    
      tr:nth-child(even) {
        background-color: lightgray;
      }
    </style>
    </head>
      <h1>Tables</h1>
      ${tables.map(table => `
        <table>
          <thead>
            <tr>
              ${table.metaData.map(col => `<th>${col.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${table.tableHTML}
          </tbody>
        </table>
      `).join('')}
    `);
          } catch (error) {
            console.error(error);
            res.send('Error Occurred');
          } finally {
          }
    });
    app.post('/logout', async (req, res) => {
      try {
      // await connection.close();
        const log = `[${new Date().toString()}] User ${req.body.username} logged out\n`;
        fs.appendFile('journalisation.txt', log, (err) => {
          if (err) throw err;
          console.log('The log was saved!');
        });
      } catch (error) {
        console.error(error);
      }
      res.redirect('/');
    });
   
    app.listen(3000, () => console.log('Server Started'));





