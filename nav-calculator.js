function calculateNAV() {
    const interestRateChange = parseFloat(document.getElementById("interestRateChange").value);
    console.log("Interest Rate Change:", interestRateChange);

    fetch('https://cors-anywhere.herokuapp.com/https://www.ishares.com/us/products/239454/ishares-20-year-treasury-bond-etf/1467271812596.ajax?fileType=csv&fileName=TLT_holdings&dataType=fund')
        .then(response => response.text())
        .then(data => {
            let lines = data.split('\n');
            let totalValue = 0;

            // Extracting and displaying the baseline date
            let baselineDate = lines[1].split('"')[1]; // Extract date from line 1
            console.log("Baseline Date:", baselineDate);
            document.getElementById('result').innerText = 'Baseline Date: ' + baselineDate;

            let shareCountLine = lines[3].split('"')[1]; // Line 3 for share count
            console.log("Parsed Share Count:", shareCountLine);
            let shareCount = parseFloat(shareCountLine.replace(/,/g, ''));
            console.log("Share Count:", shareCount);

            for (let i = 10; i < lines.length; i++) {
                let line = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

                // Check if the line contains "USD CASH" and stop processing if it does
                if (line && line[0] && line[0].includes('USD CASH')) {
                    break;
                }

                if (line && line[3]) {
                    let marketValue = parseFloat(line[3].replace(/"/g, '').replace(/,/g, ''));
                    let duration = parseFloat(line[14].replace(/"/g, ''));
                    console.log("Market Value:", marketValue, "Duration:", duration);
                    totalValue += marketValue * (1 - duration * interestRateChange / 100);
                }
            }

            let navPerShare = totalValue / shareCount;
            console.log("Total Value:", totalValue, "NAV per Share:", navPerShare);
            document.getElementById('result').innerText += '\nCalculated NAV per Share: $' + navPerShare.toFixed(2);
        })
        .catch(error => {
            console.error("An error occurred:", error);
            document.getElementById('result').innerText = 'An error occurred: ' + error;
        });
}
