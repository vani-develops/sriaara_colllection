const { useState, useEffect } = React;

function App() {
    const [sarees, setSarees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const sareesPerPage = 10;

    useEffect(() => {
        async function fetchSarees() {
            const sheetURL = "https://docs.google.com/spreadsheets/d/139WZkf0zqrcRmbrjeib0cTgwkPCPMC35zH1nS74gCQQ/gviz/tq?tqx=out:json";
            const response = await fetch(sheetURL);
            const text = await response.text();
            const json = JSON.parse(text.substring(47, text.length - 2));
            const rows = json.table.rows;

            const sareesData = rows.slice(1).map(row => ({
                name: row.c[0]?.v || "Unknown Saree",
                image: row.c[1]?.v || "https://via.placeholder.com/250",
                link: row.c[2]?.v || "#"
            }));

            setSarees(sareesData);
        }

        fetchSarees();
    }, []);

    const filteredSarees = sarees.filter(saree =>
        saree.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastSaree = currentPage * sareesPerPage;
    const indexOfFirstSaree = indexOfLastSaree - sareesPerPage;
    const currentSarees = filteredSarees.slice(indexOfFirstSaree, indexOfLastSaree);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h1>Sriaara Saree Collection</h1>
            <input
                type="text"
                placeholder="Search sarees..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            <div className="saree-container">
                {currentSarees.map((saree, index) => (
                    <div key={index} className="saree-card">
                        <img src={saree.image} alt={saree.name} />
                        <p>{saree.name}</p>
                        <a className="order-btn" href={saree.link} target="_blank">Order Now</a>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                <button 
                    className="page-btn" 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {Array.from({ length: Math.ceil(filteredSarees.length / sareesPerPage) }, (_, i) => (
                    <button 
                        key={i} 
                        className={`page-btn ${currentPage === i + 1 ? "active-page" : ""}`}
                        onClick={() => paginate(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button 
                    className="page-btn" 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === Math.ceil(filteredSarees.length / sareesPerPage)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
