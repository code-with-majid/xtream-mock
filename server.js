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
  { category_id: "3", category_name: "Movies" },
  { category_id: "4", category_name: "Kids" },
  { category_id: "5", category_name: "Music" }
]

// ✅ Real working streams from iptv-org
const streams = [
  // News
  {
    stream_id: 1,
    name: "Al Jazeera English",
    stream_icon: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Al_Jazeera_English_Logo.svg/200px-Al_Jazeera_English_Logo.svg.png",
    category_id: "1",
    container_extension: "m3u8",
    direct_source: "https://live-hls-web-aje.getaj.net/AJE/01.m3u8"
  },
  {
    stream_id: 2,
    name: "DW News",
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_symbol_2012.svg/200px-Deutsche_Welle_symbol_2012.svg.png",
    category_id: "1",
    container_extension: "m3u8",
    direct_source: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8"
  },
  {
    stream_id: 3,
    name: "France 24 English",
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/France_24_logo.svg/200px-France_24_logo.svg.png",
    category_id: "1",
    container_extension: "m3u8",
    direct_source: "https://stream.france24.com/hls/live/2037163/F24_EN_HI_HLS/master.m3u8"
  },
  {
    stream_id: 4,
    name: "NASA TV",
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png",
    category_id: "1",
    container_extension: "m3u8",
    direct_source: "https://nasa-i.akamaihd.net/hls/live/253565/NASA-NTV1-Public/master.m3u8"
  },
  // Sports
  {
    stream_id: 5,
    name: "Eurosport 1",
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Eurosport_1_logo.svg/200px-Eurosport_1_logo.svg.png",
    category_id: "2",
    container_extension: "m3u8",
    direct_source: "https://iptv-org.github.io/iptv/categories/sports.m3u"
  },
  // Kids
  {
    stream_id: 6,
    name: "Kids TV",
    stream_icon: "",
    category_id: "4",
    container_extension: "m3u8",
    direct_source: "https://iptv-org.github.io/iptv/categories/kids.m3u"
  },
  // Music
  {
    stream_id: 7,
    name: "Music TV",
    stream_icon: "",
    category_id: "5",
    container_extension: "m3u8",
    direct_source: "https://iptv-org.github.io/iptv/categories/music.m3u"
  }
]

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  const url = req.url
  console.log('Request:', url)

  if (url.includes('action=get_live_categories')) {
    res.end(JSON.stringify(categories))
  } else if (url.includes('action=get_live_streams')) {
    // ✅ Filter by category if provided
    const match = url.match(/category_id=(\d+)/)
    const filtered = match
      ? streams.filter(s => s.category_id === match[1])
      : streams
    res.end(JSON.stringify(filtered))
  } else if (url.includes('player_api.php')) {
    res.end(JSON.stringify(mockData))
  } else {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'not found' }))
  }
}).listen(process.env.PORT || 3000, () => console.log('Running'))
