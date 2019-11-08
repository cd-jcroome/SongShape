from bs4 import BeautifulSoup as bs
import requests
import urllib.request as urlr
import sys, os
import re

_URL = 'https://free-midi.org/download'

# get list of all locations for artists songs, e.g. "3-17152-a-boys-best-friend-white-stripes"
artist_name = input("what's the artist name?\n")
artist_page = requests.get(input("Where are the songs located?\n"))
soup = bs(artist_page.text, "html.parser")
tracks = soup.select('a[href^="download"]')
locs = []
for i, x in enumerate(tracks):
    locs.append(tracks[i].attrs['href'])
print(locs)

# download midi file to artist folder
for l in locs:
    rq = 'https://freemidi.org/'+l
    res = urlr.urlopen(rq)
    artist_dir = "songs/"+artist_name+"/"
    if not os.path.exists(artist_dir):
        os.makedirs(artist_dir)
    midi = open(artist_dir+l+".midi","wb")
    midi.write(res.read())
    midi.close
    print("ding!")
