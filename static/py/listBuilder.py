import os

songs = [s for s in os.listdir('../../output/librosa_128') if s.endswith('_summ.csv')]

os.system(f'cat {songs} > ../data/songs.txt')

print(songs)