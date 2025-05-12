document.addEventListener("DOMContentLoaded", () => {
    fetch('consumables.csv')
        .then(res => res.text())
        .then(text => {
            // Split the CSV text into rows
            const allLines = text
                .trim()
                .split(/\r?\n/)
                .filter(line => line.length > 0);
            if (allLines.length < 2) return;

            // Get the header row
            const [ headerLine, ...dataLines ] = allLines;
            const headers = headerLine.split(',').map(header => header.trim());

            // Parse the data rows into objects
            const cards = dataLines.map(line => {
                const values = line.match(/(".*?"|[^",]+)(?=,|$)/g)
                    .map(value => value.replace(/^"|"$/g, ''));
                const obj = {};
                headers.forEach((h, i) => {
                    obj[h] = values[i]|| '';
                });
                return obj;
            });
            // Group by the section field
            const groups = cards.reduce((acc, c) => {
                const section = c.section || 'Uncategorized';
                if (!acc[section]) acc[section] = [];
                acc[section].push(c);
                return acc;
            }, {});
            // Render into main
            const main = document.querySelector('main');
            main.innerHTML = ''; // Clear any existing content

            Object.entries(groups).forEach(([sectionName, groupCards]) => {
                // Section header
                const sectionHeader = document.createElement('h2');
                sectionHeader.className = 'section-header';
                sectionHeader.textContent = sectionName;
                main.appendChild(sectionHeader);

                // Section container
                const sectionContainer = document.createElement('div');
                sectionContainer.className = 'section-container';  
                main.appendChild(sectionContainer);
                
                // Create a card for each item in the group
                groupCards.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'cards';
                    card.innerHTML = `
                        <div class="cards-front">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="cards-back">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                        `;
                    sectionContainer.appendChild(card);
                });
            });
        })
        .catch(err => console.error('Failed to load consumables.csv:', err));
});
