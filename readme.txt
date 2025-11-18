for date

ALTER TABLE votes ADD voteDateTime DATETIME NULL;

BackEnd
 const finalDateTime = voteDateTime || selectedDate || new Date();

FrontEnd
<input type="datetime-local" id="voteDateTime" required>

 const selectedDateTime = document.getElementById('voteDateTime').value;  
 voteDateTime: selectedDateTime.replace("T", " ")  // ⬅ convert to MySQL format
