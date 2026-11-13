# xtream-mock

A tiny **mock Xtream Codes API server** for building and testing IPTV apps, with no real IPTV provider or subscription needed.

It answers the same `player_api.php` requests a real Xtream Codes panel does (login, live categories, live streams) and redirects stream URLs to free, publicly available test streams. Point your IPTV app at it during development, demos or automated tests.

- ✅ Zero dependencies: plain Node.js `http`, a single file
- ✅ Xtream-style login with test credentials
- ✅ Live TV categories and channels, with category filtering
- ✅ Stream URLs (`/live/user/pass/id.m3u8`) redirect to real HLS test streams
- ✅ CORS enabled, so it works from web players too
- ✅ Deploys anywhere that runs Node (Railway, Render, Fly.io, a VPS…)

---

## Quick start

Requires **Node.js 14 or newer**.

```bash
git clone https://github.com/code-with-majid/xtream-mock.git
cd xtream-mock
npm start
```

The server starts on **http://localhost:3000**. Set the `PORT` environment variable to use another port:

```bash
PORT=8080 npm start
```

## Test credentials

| Field    | Value      |
|----------|------------|
| Server   | `http://localhost:3000` (or your deployed URL) |
| Username | `testuser` |
| Password | `testpass` |

Any other username or password gets `401` with `{"user_info":{"auth":0}}`, so you can also test your app's "wrong login" handling.

---

## API reference

All API calls go to `player_api.php` with the credentials as query parameters.

### 1. Login / account info

```
GET /player_api.php?username=testuser&password=testpass
```

Returns `user_info` (auth status, expiry, max connections, allowed formats) and `server_info` (URL, ports, timezone, current server time).

```json
{
  "user_info": { "username": "testuser", "auth": 1, "status": "Active", "exp_date": "1999999999", "max_connections": "1", "allowed_output_formats": ["m3u8", "ts", "rtmp"] },
  "server_info": { "port": "80", "https_port": "443", "server_protocol": "https", "timezone": "Europe/London", "timestamp_now": 1763020800, "time_now": "2026-11-13 08:00:00" }
}
```

### 2. Live categories

```
GET /player_api.php?username=testuser&password=testpass&action=get_live_categories
```

```json
[
  { "category_id": "1", "category_name": "News",   "parent_id": 0 },
  { "category_id": "2", "category_name": "Sports", "parent_id": 0 },
  { "category_id": "3", "category_name": "Movies", "parent_id": 0 },
  { "category_id": "4", "category_name": "Kids",   "parent_id": 0 },
  { "category_id": "5", "category_name": "Music",  "parent_id": 0 }
]
```

### 3. Live streams

All channels:

```
GET /player_api.php?username=testuser&password=testpass&action=get_live_streams
```

Only one category (for example, News):

```
GET /player_api.php?username=testuser&password=testpass&action=get_live_streams&category_id=1
```

Each stream looks like a real Xtream entry:

```json
{
  "num": 2,
  "name": "DW News",
  "stream_type": "live",
  "stream_id": 2,
  "stream_icon": "https://…/Deutsche_Welle_symbol_2012.svg.png",
  "epg_channel_id": "DWNews.de",
  "category_id": "1",
  "tv_archive": 0,
  "container_extension": "m3u8"
}
```

### 4. Play a stream

Build the stream URL the standard Xtream way:

```
GET /live/{username}/{password}/{stream_id}.m3u8
```

Example:

```
http://localhost:3000/live/testuser/testpass/2.m3u8
```

The server answers with a **302 redirect** to that channel's public HLS stream, so ExoPlayer / Media3, VLC, AVPlayer and hls.js just follow it and play. Unknown stream IDs return `404`.

### Errors

| Situation | Status | Body |
|-----------|--------|------|
| Wrong or missing credentials | `401` | `{"user_info":{"auth":0}}` |
| Unknown stream ID | `404` | `{"error":"stream not found"}` |
| Unknown path | `404` | `{"error":"not found"}` |

---

## Try it with curl

```bash
# login
curl "http://localhost:3000/player_api.php?username=testuser&password=testpass"

# categories
curl "http://localhost:3000/player_api.php?username=testuser&password=testpass&action=get_live_categories"

# news channels only
curl "http://localhost:3000/player_api.php?username=testuser&password=testpass&action=get_live_streams&category_id=1"

# where does stream 2 redirect?
curl -I "http://localhost:3000/live/testuser/testpass/2.m3u8"
```

## Use it from an Android app

**On the emulator**, `localhost` is the emulator itself, so use `10.0.2.2` to reach your computer:

```
Server:   http://10.0.2.2:3000
Username: testuser
Password: testpass
```

**On a real phone**, use your computer's local IP (for example `http://192.168.1.20:3000`) with both devices on the same Wi-Fi, or deploy the server (see below).

> Because the local server uses plain `http`, Android 9+ needs cleartext traffic allowed for debug builds, e.g. `android:usesCleartextTraffic="true"` in a debug manifest or a `network_security_config` for that host.

Example with Retrofit:

```kotlin
interface XtreamApi {
    @GET("player_api.php")
    suspend fun login(
        @Query("username") user: String,
        @Query("password") pass: String
    ): LoginResponse

    @GET("player_api.php")
    suspend fun liveStreams(
        @Query("username") user: String,
        @Query("password") pass: String,
        @Query("action") action: String = "get_live_streams",
        @Query("category_id") categoryId: String? = null
    ): List<LiveStream>
}

// Playing a channel with Media3 / ExoPlayer
val url = "$baseUrl/live/$user/$pass/${stream.streamId}.m3u8"
player.setMediaItem(MediaItem.fromUri(url))
player.prepare()
player.play()
```

---

## Deploy

It's a single Node file with no dependencies, so any Node host works:

- **Railway / Render / Fly.io:** create a service from this repo with start command `npm start`. The platform sets `PORT` automatically.
- **VPS:** `PORT=80 node server.js` (or run it behind nginx / pm2).

After deploying, you may want to update `server_info.url` in `server.js` to your public hostname so the login response shows the right server.

## Customise the data

Everything lives in `server.js`:

- `categories`: add or rename categories
- `streams`: add channels (`stream_id`, `name`, `category_id`, `stream_icon`, `direct_source` = the real stream URL to redirect to)
- `mockData.user_info`: change expiry, max connections, status (e.g. `"Expired"` to test that flow)
- Credentials: change `testuser` / `testpass` in the auth check

## Current limitations

This mock covers the **live TV** flow only. These Xtream actions are **not implemented yet** and return the login response instead:

- VOD / movies (`get_vod_categories`, `get_vod_streams`, `get_vod_info`)
- Series (`get_series_categories`, `get_series`, `get_series_info`)
- EPG (`get_short_epg`, `get_simple_data_table`, `xmltv.php`)
- M3U playlist export (`get.php`)

Pull requests are welcome.

## Notes

- The test streams are public broadcaster feeds (Al Jazeera, DW, France 24, NASA, Red Bull TV, …). They are not hosted by this project and may change or go offline at any time.
- Some entries (Baby TV, Music Box) point to iptv-org `.m3u` playlists rather than a single stream, so a player may not open them directly.
- This is a **development and testing tool**. It is not an IPTV service and does not provide any content.
