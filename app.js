import mysql from 'mysql';
import express from 'express';
const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', 'views');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'election',
})

db.connect((error) => {
    if(error){
        console.log("Error connecting to the Database")
    } else {
        console.log("Connected to the Database")
    }
})

//------------------------------------------------------------------------------------------------------ FOR POSITION TABLE
app.get('/getallposition', (req,res)=>{
    db.query('SELECT * FROM positions', (error, result)=>{
    if (error){
        res.status(500).json({error: error.message})
    } else {
        res.status(200).json(result)
    }
    })
})

// Postions because i made i mistake in creating table instead of positions
app.post('/addposition', (req,res)=>{
    const {posName, numOfPostion, postStat} = req.body;
    db.query('INSERT INTO positions(posName, numOfPostions, posStat) VALUES(?,?,?)', [posName, numOfPostion, postStat], (error, result)=>{
        if(error){
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})

app.put('/updateposition/:id', (req, res)=>{
    const postID = req.params.id;
    const {posName, numOfPostion} = req.body;
    db.query('UPDATE positions set posName = ?, numOfPostions = ? WHERE posID = ?', [posName, numOfPostion, postID], (error, result)=>{
        if(error){
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})

app.post('/positionstatus/:id', (req, res)=>{
    const posID = req.params.id;
    const {postStat} = req.body;
    db.query('UPDATE positions set postStat = ? WHERE posID = ?', [postStat, posID], (error, result)=>{
        if(error){
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})

//------------------------------------------------------------------------------------------------------ FOR VOTER TABLE
app.get('/getallvoter', (req,res)=>{
    db.query('SELECT * FROM voters', (error, result)=>{
        if(error){
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})

app.post('/addvoter', (req,res)=>{
    const {voterPass, voterFName, voterMName, voterLName} = req.body;
    db.query('INSERT INTO voters(voterPass, voterFName, voterMName, voterLName) VALUES(?,?,?,?)', [voterPass, voterFName, voterMName, voterLName], (error, result)=>{
        if(error){
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})

app.put('/updatevoter/:id', (req,res)=>{
    const voterID = req.params.id;
    const {voterPass, voterFName, voterMName, voterLName} = req.body;
    db.query('UPDATE voters SET voterPass = ?, voterFName =? , voterMName=?, voterLName=? WHERE voterID = ?', [voterPass, voterFName, voterMName, voterLName, voterID], (error, result)=>{
        if(error){
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})

app.post('/voterstatus/:id', (req, res)=>{
    const voterID = req.params.id;
    const {voterStat} = req.body;
    db.query('UPDATE voters set voterStat = ? WHERE voterID = ?', [voterStat, voterID], (error, result)=>{
        if(error){
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})

app.post('/voted/:id', (req,res)=>{
    const voterID = req.params.id;
    const {voted} = req.body;
    db.query('UPDATE voters set voted = ? WHERE voterID = ?', [voted, voterID], (error, result)=>{
        if(error){
            res.status(5000).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})

//------------------------------------------------------------------------------------------------------ FOR CANDIDATE TABLE

app.get('/getallcandidates', (req,res)=> {
    db.query('SELECT * FROM candidates', (error, result)=> {
        if(error){
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})

app.post('/addcandidate', (req,res)=>{
    const {canFName, canMName, canLName, posID} = req.body;
    db.query(`
    SELECT 
        p.posID,
        p.numOfPostions,
        COUNT(c.candID) as occupying
    FROM 	positions p
    LEFT JOIN candidates c ON c.posID = p.posID
    GROUP BY p.posID;
    `,(error, result)=>{
        if(error){
            return res.status(500).json({error: error.message})
        }
        if(result.length <= 0){
            return res.status(404).json({error: 'No Position is available'})
        }
        const position = result.find(row => row.posID === posID);
        if(!position){
            return res.status(404).json({error: 'Position not found'})
        }
        if(position.occupying >= position.numOfPostion){
            return res.status(401).json({error: 'Position is full'})
        }        
        db.query('SELECT * FROM positions', (error, result)=>{
            if(result.length > 0){
                db.query('INSERT INTO candidates(canFName, canMName, canLName, posID) VALUES(?,?,?,?)', [canFName, canMName, canLName, posID], (error, result)=>{
                    if(error){
                        res.status(500).json({error: error.message})
                    } else {
                        res.status(200).json(result)
                    }
                })
            } else {
                return res.status(401).json({error: 'No positions are available yet'})
            }
        })
    
    })
    
    
})

app.put('/updatecandidate', (req,res)=>{
    const canID = req.params.id;
    const {canFName, canMName, canLName, posID} = req.body;
    db.query('UPDATE candidate SET canFName=?, canMName=?, canLName=?, posID=? WHERE canID = ?', [canFName, canMName, canLName, posID, canID], (error, result)=>{
        if(error){
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})

//------------------------------------------------------------------------------------------------------ FOR VOTE TABLE

app.get('/getallvotes', (req, res)=>{
    db.query('SELECT * FROM votes', (error, result)=>{
        if(error){
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})

app.post('/login', (req,res)=>{
    const {voterID, voterPass} = req.body;
    
    db.query('SELECT * FROM voters WHERE voterID = ? AND voterPass = ?', [voterID, voterPass], (error, result) => {
        if(error){
            return res.status(500).json({error: error.message})
        } 
        if(result.length > 0){
            res.status(200).json(result)
            
        } else {
            res.status(401).json({error: 'Voter not found. Please create one'})
        }
    })
})

app.get('/getallpositionswithcandidates', (req,res)=>{
    db.query(`
            SELECT p.*, c.*
            FROM positions p
            LEFT JOIN candidates c
            ON p.posID = c.posID
        `, (error, result)=>{
            if(error){
                res.status(500).json({error: error.message})
            } else {
                res.status(200).json(result)
            }
        })
})

app.post('/vote', (req,res)=>{
    const {posID, voterID, candID} = req.body;
    const voted = "Y";
    db.query('SELECT voted FROM voters WHERE voterID = ?', [voterID], (error, result)=>{
        if(result.length > 0 && result[0].voted === 'Y'){
            res.status(401).json({error: 'Voter Already Voted'})
        } else {
            db.query('INSERT INTO votes(posID, voterID, candID) VALUES(?,?,?)', [posID, voterID, candID], (error, result)=>{
                if(error){
                    res.status(500).json({error: error.message})
                } else {
                    
                    db.query('UPDATE voters SET voted =? WHERE voterID =?', [voted, voterID], (error, result)=>{
                        if(error){
                            res.status(500).json({error: error.message})
                        } else {
                            res.status(200).json(result)
                        }
                    })
                }
            })
        }
    })
    
})

app.get('/getelectionresult', (req,res)=>{
    db.query(`
        SELECT 
            Concat(c.canFName, '' , canMName , '' , canLName) AS fullname,
            p.posName,
            COUNT(v.voterID) as totalvotes,
            ROUND(
                COUNT(v.voterID) * 100.0 /
                SUM(COUNT(v.voterID)) OVER (PARTITION BY p.posID),
            2
            ) AS percentage
        FROM 	candidates c
        LEFT JOIN votes v ON c.candID = v.candID
        LEFT JOIN positions p ON c.posID = p.posID
        GROUP BY p.posID, fullname
        ORDER BY p.posID, totalvotes DESC;
	`,(error, result)=>{
        if (error){
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})

app.get('/getwinners', (req,res)=>{
    db.query(`
            WITH RankedCandidates AS (
            SELECT 
                CONCAT(c.canFName, ' ', c.canMName, ' ', c.canLName) AS winner,
                p.posName,
                COUNT(v.voterID) AS totalvotes,
                ROW_NUMBER() OVER(PARTITION BY p.posID ORDER BY COUNT(v.voterID) DESC) AS rank
            FROM candidates c
            LEFT JOIN votes v ON c.candID = v.candID
            LEFT JOIN positions p ON c.posID = p.posID
            GROUP BY p.posID, c.candID, winner, p.posName
            )
            SELECT posName, winner, totalvotes
            FROM RankedCandidates
            WHERE rank = 1;  
        `, (error,result)=> {
        if(error){
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json(result)
        }
    })
})
app.get('/viewwinner', (req, res)=>{
    res.render('winners')
})
app.get('/viewresult', (req,res)=>{
    res.render('result')
})
app.get('/voter', (req, res)=> {
    res.render('vote')
})
app.get('/', (req,res)=>{
    res.render('index')
})
app.listen(PORT, ()=>{
    console.log(`Listening to Port: ${PORT}`)
})

