const http = require('http')

const mockData = {
  user_info: {
    username: "testuser",
    status: "Active",
    exp_date: "1999999999",
    max_connections: "1",
    active_cons: "0"
  },
  server_info: { url: "localhost", port: "3000" }
}

const categories = [
  { category_id: "1", category_name: "News" },
  { category_id: "2", category_name: "Sports" },
  { category_id: "3", category_name: "Movies" }
]

const streams = [
  { stream_id: 1, name: "BBC News", stream_icon: "", category_id: "1", container_extension: "m3u8" },
  { stream_id: 2, name: "CNN", stream_icon: "", category_id: "1", container_extension: "m3u8" },
  { stream_id: 3, name: "ESPN", stream_icon: "", category_id: "2", container_extension: "m3u8" },
  { stream_id: 4, name: "Sky Sports", stream_icon: "", category_id: "2", container_extension: "m3u8" },
  { stream_id: 5, name: "Action Movies", stream_icon: "", category_id: "3", container_extension: "m3u8" }
]

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  const url = req.url
  console.log('Request:', url)
  if (url.includes('action=get_live_categories')) {
    res.end(JSON.stringify(categories))
  } else if (url.includes('action=get_live_streams')) {
    res.end(JSON.stringify(streams))
  } else if (url.includes('player_api.php')) {
    res.end(JSON.stringify(mockData))
  } else {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'not found' }))
  }
}).listen(process.env.PORT || 3000, () => console.log('Running'))
