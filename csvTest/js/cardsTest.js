document.addEventListener('DOMContentLoaded', () =>{
    fetch('cards.csv')
        .then(r => r.text())
        .then(text => {
            // 1) split on \r?\n and drop any empty lines
            const allLines = text
                .trim()
                .split(/\r?\n/)
                .filter(line => line.length);
            if (allLines.length < 2){
                console.warn('No data in cards.csv');
                return;
            }
             // 2) take the first line as headers
            const [headerLine, ...dataLines] = allLines;

            // 3) declare headers BEFORE using them
            const headers = headerLine
                .split(',')
                .map(h => h.trim()); // ["image","title","description","tagClass","tag"]

            // 4) build your array of card objects
            const cards = dataLines.map(line => {
                // basic CSV field extraction (handles quoted commas)
                const values = line.match(/(".*?"|[^",]+)(?=,|$)/g)
                          .map(v => v.replace(/^"|"$/g, '')); 

                // now map headers → values
                const obj = {};
                headers.forEach((h, i)=> {
                    obj[h] = values[i];
                });
                return obj;
            });

            // 5) Render them
            const container = document.getElementById('cards');
            cards.forEach (c => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-front">
                        <img src="${c.image}" alt="${c.title}">
                    </div>
                    <div class="card-back">
                        <h2>${c.title}</h2>
                        <p>${c.description}</p>
                        <div class="${c.tagClass}">${c.tag}</div>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(console.error);
});