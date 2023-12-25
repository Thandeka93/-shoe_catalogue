function ShoeCatalogue() {
    async function filterShoes(brand, colour, size) {

        const brandSelection = brand === "default";
        const colourSelection = colour === "default";
        const sizeSelection = size === "default";

        if (brandSelection && colourSelection && sizeSelection) {
            const result = await axios.get(`https://shoes-api-o60a.onrender.com/api/shoes`)
            return result.data;
        } else if(!brandSelection && !colourSelection && !sizeSelection) {
            const result = await axios.get(`https://shoes-api-o60a.onrender.com/api/shoes/brand/${brand}/colour/${colour}/size/${size}`)
            return result.data;
        } else if (!brandSelection && !colourSelection) {
            const result = await axios.get(`https://shoes-api-o60a.onrender.com/api/shoes/brand/${brand}/colour/${colour}`)
            return result.data;
        } else if (!brandSelection && !sizeSelection) {
            const result = await axios.get(`https://shoes-api-o60a.onrender.com/api/shoes/brand/${brand}/size/${size}`)
            return result.data;
        } else if (!colourSelection && !sizeSelection) {
            const result = await axios.get(`https://shoes-api-o60a.onrender.com/api/shoes/colour/${colour}/size/${size}`)
            return result.data;
        } else if (!brandSelection) {
            const result = await axios.get(`https://shoes-api-o60a.onrender.com/api/shoes/brand/${brand}`)
            return result.data;
        } else if (!sizeSelection) {
            const result = await axios.get(`https://shoes-api-o60a.onrender.com/api/shoes/size/${size}`)
            return result.data;
        } else if (!colourSelection) {
            const result = await axios.get(`https://shoes-api-o60a.onrender.com/api/shoes/colour/${colour}`)
            return result.data;
        }

    }

    return {
        filterShoes
    }
}