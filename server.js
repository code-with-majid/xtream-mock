const http = require('http')

const getTimestamp = () => Math.floor(Date.now() / 1000)

const mockData = {
  user_info: {
    username: "testuser",
    password: "testpass",
    message: "",
    auth: 1,
    status: "Active",
    exp_date: "1999999999",
    is_trial: "0",
    active_cons: "0",
    created_at: "1609459200",
    max_connections: "1",
    allowed_output_formats: ["m3u8", "ts", "rtmp"]
  },
  server_info: {
    url: "xtream-mock-production.up.railway.app",
    port: "80",
    https_port: "443",
    server_protocol: "https",
    rtmp_port: "1935",
    timezone: "Europe/London",
    timestamp_now: getTimestamp(),
    time_now: new Date().toISOString().replace('T', ' ').substring(0, 19)
  }
}

const categories = [
  { category_id: "1", category_name: "News", parent_id: 0 },
  { category_id: "2", category_name: "Sports", parent_id: 0 },
  { category_id: "3", category_name: "Movies", parent_id: 0 },
  { category_id: "4", category_name: "Kids", parent_id: 0 },
  { category_id: "5", category_name: "Music", parent_id: 0 }
]

const streams = [
  // ─── News ───────────────────────────────────────────────────────
  {
    num: 1,
    name: "Al Jazeera English",
    stream_type: "live",
    stream_id: 1,
    stream_icon: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Al_Jazeera_English_Logo.svg/200px-Al_Jazeera_English_Logo.svg.png",
    epg_channel_id: "AlJazeeraEnglish.qa",
    added: "1609459200",
    category_id: "1",
    custom_sid: "",
    tv_archive: 0,
    direct_source: "https://live-hls-web-aje.getaj.net/AJE/01.m3u8",
    tv_archive_duration: 0,
    container_extension: "m3u8",
    thumbnail: ""
  },
  {
    num: 2,
    name: "DW News",
    stream_type: "live",
    stream_id: 2,
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_symbol_2012.svg/200px-Deutsche_Welle_symbol_2012.svg.png",
    epg_channel_id: "DWNews.de",
    added: "1609459200",
    category_id: "1",
    custom_sid: "",
    tv_archive: 0,
    direct_source: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8",
    tv_archive_duration: 0,
    container_extension: "m3u8",
    thumbnail: ""
  },
  {
    num: 3,
    name: "France 24 English",
    stream_type: "live",
    stream_id: 3,
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/France_24_logo.svg/200px-France_24_logo.svg.png",
    epg_channel_id: "France24English.fr",
    added: "1609459200",
    category_id: "1",
    custom_sid: "",
    tv_archive: 0,
    direct_source: "https://stream.france24.com/hls/live/2037163/F24_EN_HI_HLS/master.m3u8",
    tv_archive_duration: 0,
    container_extension: "m3u8",
    thumbnail: ""
  },
  {
    num: 4,
    name: "NASA TV",
    stream_type: "live",
    stream_id: 4,
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png",
    epg_channel_id: "NASATV.us",
    added: "1609459200",
    category_id: "1",
    custom_sid: "",
    tv_archive: 0,
    direct_source: "https://nasa-i.akamaihd.net/hls/live/253565/NASA-NTV1-Public/master.m3u8",
    tv_archive_duration: 0,
    container_extension: "m3u8",
    thumbnail: ""
  },
  // ─── Sports ─────────────────────────────────────────────────────
  {
    num: 5,
    name: "Red Bull TV",
    stream_type: "live",
    stream_id: 5,
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Red_Bull_logo.svg/200px-Red_Bull_logo.svg.png",
    epg_channel_id: "RedBullTV",
    added: "1609459200",
    category_id: "2",
    custom_sid: "",
    tv_archive: 0,
    direct_source: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
    tv_archive_duration: 0,
    container_extension: "m3u8",
    thumbnail: ""
  },
  // ─── Kids ───────────────────────────────────────────────────────
  {
    num: 6,
    name: "Baby TV",
    stream_type: "live",
    stream_id: 6,
    stream_icon: "",
    epg_channel_id: "BabyTV",
    added: "1609459200",
    category_id: "4",
    custom_sid: "",
    tv_archive: 0,
    direct_source: "https://iptv-org.github.io/iptv/categories/kids.m3u",
    tv_archive_duration: 0,
    container_extension: "m3u8",
    thumbnail: ""
  },
  // ─── Music ──────────────────────────────────────────────────────
  {
    num: 7,
    name: "Music Box",
    stream_type: "live",
    stream_id: 7,
    stream_icon: "",
    epg_channel_id: "MusicBox",
    added: "1609459200",
    category_id: "5",
    custom_sid: "",
    tv_archive: 0,
    direct_source: "https://iptv-org.github.io/iptv/categories/music.m3u",
    tv_archive_duration: 0,
    container_extension: "m3u8",
    thumbnail: ""
  }
]

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  const url = req.url
  console.log('Request:', url)

  // ✅ Validate credentials
  const hasUser = url.includes('username=testuser')
  const hasPass = url.includes('password=testpass')

  if (!hasUser || !hasPass) {
    res.writeHead(401)
    res.end(JSON.stringify({ user_info: { auth: 0 } }))
    return
  }

  if (url.includes('action=get_live_categories')) {
    res.end(JSON.stringify(categories))

  } else if (url.includes('action=get_live_streams')) {
    const match = url.match(/category_id=(\d+)/)
    const filtered = match
      ? streams.filter(s => s.category_id === match[1])
      : streams
    res.end(JSON.stringify(filtered))

  } else if (url.includes('player_api.php')) {
    // ✅ Update timestamp on each auth request
    mockData.server_info.timestamp_now = getTimestamp()
    mockData.server_info.time_now = new Date()
      .toISOString().replace('T', ' ').substring(0, 19)
    res.end(JSON.stringify(mockData))

  } else if (url.includes('/live/')) {
    // ✅ Stream URL hit — redirect to actual stream
    const streamIdMatch = url.match(/\/live\/\w+\/\w+\/(\d+)/)
    if (streamIdMatch) {
      const stream = streams.find(s => s.stream_id === parseInt(streamIdMatch[1]))
      if (stream?.direct_source) {
        res.writeHead(302, { Location: stream.direct_source })
        res.end()
        return
      }
    }
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'stream not found' }))

  } else {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'not found' }))
  }

}).listen(process.env.PORT || 3000, () => console.log('Mock Xtream running'))
