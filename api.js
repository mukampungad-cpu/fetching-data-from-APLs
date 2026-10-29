
export async function fetchData() {
    try {
        const response = await fetch(
            "https://dummyjson.com/products"
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return null;
    }
}
