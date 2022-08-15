let sockets = new Map()

const setupWebSocket = ({url, path, uniqueID = false, send_data = null}, callback) => {
    const stream = new WebSocket(url + path)

    // Event stream
    stream.onopen = () => {
        console.log('[socket] Connected to exchange')
        if (send_data) {
            const msg = JSON.stringify(send_data)
            stream.send(msg)
            console.log(`[socket] Sent ${msg}`)
        }
    }
    stream.onclose = () => console.log('[socket] Connected closed')
    stream.onmessage = (message) => {
         callback({msg: JSON.parse(message.data), socket: stream})
    }
    stream.onerror = (err) => console.error(err)

    updateSockets({ path, uniqueID }, stream) // Need to control open streams
    return stream
}

// Recreate stream if open repeatedly
const updateSockets = ({ path, uniqueID }, socket) => {
    if (uniqueID) {
        return sockets.set(uniqueID, socket)
    }

    const key = path.toString()
    closeSocket(key)
    return sockets.set(key, socket)
}

// Close connections
const closeSockets = () => {
    sockets.forEach((value, key) => closeSocket(key))
}

// Close connection
const closeSocket = (key) => {
    if (sockets.has(key)) {
        sockets.get(key).close(1000)
        return sockets.delete(key)
    }
}

export {
    updateSockets,
    closeSockets,
    closeSocket,
    setupWebSocket,
}
