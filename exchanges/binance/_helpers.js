const { streamSchema } = require('./_schema')

// Rename Object
const renameObj = (schema, obj) => Object.keys(obj).reduce((result, item) => {
	// Rename nested Array of Objects or Array of Arrays
    // eslint-disable-next-line valid-typeof
	if (typeof schema[item] == "object" || typeof schema[item] == "array") {
		result[item] = obj[item]
		result[item] = renameKeys(schema[item], obj[item])
	}
	// Rename deep Object or Array
    // eslint-disable-next-line valid-typeof
	else if (typeof obj[item] == "object" || typeof obj[item] == "array") {
		result[schema[item] || item] = obj[item];
		result[schema[item]] = renameKeys(schema[schema[item]], obj[item]);
	} else {
		result[schema[item] || item] = obj[item]; // rename key
	}
	return result
}, {})

// Check Object or Array
const renameKeys = (schema = {}, data = {} || []) => {
	return Array.isArray(data) ? data.map((item) => renameObj(schema, item)) : renameObj(schema, data)
}

export const rename = (data) => {
    const event = (data.e || data[0] && typeof data[0].e != 'undefined') ? (data.e || data[0].e) : 'bookTicker'
    return renameKeys(streamSchema[event], data)
}

