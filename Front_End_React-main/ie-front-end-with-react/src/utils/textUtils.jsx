function normalizeText(input) {
    const from = "áéíóúÁÉÏOU";
    const to = "aeiouAEIOU";
    const mapping = {};

    for (let i = 0; i < from.length; i++) {
        mapping[from.charAt(i)] = to.charAt(i);
    }

    const result = input.replace(/[\s+]/g, '')
        .split('').map((char) => mapping[char] || char).join('').toLowerCase();

    return result;
}

export default normalizeText;