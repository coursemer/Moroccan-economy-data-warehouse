document.addEventListener("DOMContentLoaded", function () {
    // GDP Growth Chart
    const ctxGDP = document.getElementById("gdpChart").getContext("2d");
    new Chart(ctxGDP, {
        type: "line",
        data: {
            labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
            datasets: [{
                label: "GDP Growth (%)",
                data: [4.2, 3.8, 2.5, 3.1, 4.0, 3.5], // Removed template syntax for demo
                borderColor: "#00ff00",
                backgroundColor: "rgba(0, 255, 0, 0.1)",
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: "#0f0" } },
                tooltip: {
                    bodyColor: "#0f0",
                    titleColor: "#0f0"
                }
            },
            scales: {
                x: { ticks: { color: "#0f0" } },
                y: { ticks: { color: "#0f0" } }
            }
        }
    });

    // Sector Contribution Chart
    const ctxSector = document.getElementById("sectorChart").getContext("2d");
    const sectorData = [25, 20, 15, 10, 30]; // Sample data
    new Chart(ctxSector, {
        type: "pie",
        data: {
            labels: ["Agriculture", "Manufacturing", "Services", "Technology", "Finance"],
            datasets: [{
                label: "Sector Contribution (%)",
                data: sectorData,
                backgroundColor: [
                    "#00ff00", "#00ccff", "#ffcc00", "#ff6600", "#cc00cc"
                ]
            }]
        },
        options: {
            plugins: {
                legend: { labels: { color: "#0f0" } },
                tooltip: {
                    bodyColor: "#0f0",
                    titleColor: "#0f0"
                }
            }
        }
    });

    // Trade Balance Chart
    const ctxTrade = document.getElementById("tradeChart").getContext("2d");
    new Chart(ctxTrade, {
        type: "bar",
        data: {
            labels: ["Exports", "Imports", "Balance"],
            datasets: [{
                label: "USD (Billion)",
                data: [450, 400, 50], // Sample data
                backgroundColor: [
                    "#00ff00", "#ff0000", "#ffff00"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    bodyColor: "#0f0",
                    titleColor: "#0f0"
                }
            },
            scales: {
                x: { ticks: { color: "#0f0" } },
                y: { ticks: { color: "#0f0" } }
            }
        }
    });
});