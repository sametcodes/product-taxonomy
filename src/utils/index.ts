
export const parseCSV = (csv: string): { id: string, name: string }[] => {
    const [headers, ...lines] = csv.split("\n")
    return lines.map(line => {
        const [id, name] = line.split("\t")
        return { id, name: name.trim() }
    })
}