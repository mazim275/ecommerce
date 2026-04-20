async function add() {
    try {
        const res = await fetch("http://localhost:3000/api/addproduct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test Shirt",
                category: "Men",
                price: 199,
                description: "A nice shirt",
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
                adminId: "650c1f1e1c9d440000a1b1c1"
            })
        });

        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

add();
