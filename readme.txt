for date

ALTER TABLE votes ADD voteDateTime DATETIME NULL;

BackEnd
 const finalDateTime = voteDateTime || selectedDate || new Date();

FrontEnd
<input type="datetime-local" id="voteDateTime" required>

 const selectedDateTime = document.getElementById('voteDateTime').value;  
 voteDateTime: selectedDateTime.replace("T", " ")  // ⬅ convert to MySQL format

for search

let positions = [];
.then(data => {
        positions = data;
        displayPositions(positions);
    });

<input type="text" id="searchPos" placeholder="Search position..." oninput="searchPosition()">

function searchPosition() {
    const keyword = document.getElementById('searchPos').value.toLowerCase();

    const filtered = positions.filter(p =>
        p.posName.toLowerCase().includes(keyword)
    );

    displayPositions(filtered);
}
