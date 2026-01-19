const fs = require('fs');
try {
    const data = fs.readFileSync('temp_response.json', 'utf16le'); // Try utf16le first
    const json = JSON.parse(data);
    const hasDocs = json.content && json.content.some(agent => agent.uploadedDocuments && agent.uploadedDocuments.length > 0);
    console.log('Has uploadedDocuments:', hasDocs);
    if (json.content && json.content.length > 0) {
        console.log('First agent keys:', Object.keys(json.content[0]));
    }
} catch (e) {
    console.error('Error reading/parsing:', e.message);
    // Try utf8 if utf16le fails
    try {
        const data = fs.readFileSync('temp_response.json', 'utf8');
        const json = JSON.parse(data);
        const hasDocs = json.content && json.content.some(agent => agent.uploadedDocuments && agent.uploadedDocuments.length > 0);
        console.log('Has uploadedDocuments (utf8):', hasDocs);
        if (json.content && json.content.length > 0) {
            console.log('First agent keys:', Object.keys(json.content[0]));
        }
    } catch (e2) {
        console.error('Error reading/parsing utf8:', e2.message);
    }
}
