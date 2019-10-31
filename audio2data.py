import pandas as pd
import numpy as np
import librosa

import csv
from os import listdir
from os.path import isfile, join, splitext

# for all of the audio files in a given folder...
songs_folder = input("where are the songs? (hit enter if they're in the same folder)\n")
files = [f for f in listdir('./songs/'+songs_folder+'/') if isfile(join('./songs/'+songs_folder+'/',f))]
print(files)

def audio2data(path):
    notes = ['C','C#/Db','D','D#/Eb','E','F','F#/Gb','G','G#/Ab','A','A#/Bb','B']
    # use librosa to analyze file
    print('analyzing {}...'.format(f))
    y, sr = librosa.load('./songs/'+songs_folder+'/'+path)
    y_harmonic = librosa.effects.hpss(y)[0]
    C = librosa.feature.chroma_cqt(y=y_harmonic, sr=sr, bins_per_octave=36)
    # make the dataframes
    c_df = pd.DataFrame(notes).join(pd.DataFrame(C),lsuffix='n').melt(id_vars='0n').rename(columns={'0n': "Note", "variable": "Time","index":"key"})
    c_df_summary_1 = c_df.groupby(['Note']).mean()
    c_df_summary_2 = c_df.groupby(['Note']).median()
    c_df_summary = c_df_summary_1.join(c_df_summary_2,on=['Note'],lsuffix='_mean').rename(columns={'value_mean':'Mean','value':'Median'})
    # convert to csv
    print('...converting {} to CSV...'.format(f))
    m_csv = join('./output/librosa/',splitext(f)[0],'.csv').replace("/.csv",".csv")
    m_summ_csv = join('./output/librosa/',splitext(f)[0],'.csv').replace("/.csv","_summ.csv")
    c_df.to_csv(m_csv)
    c_df_summary.to_csv(m_summ_csv)
    print('{} completed!'.format(f))
## convert midifile to pandas df
for f in files:
    if f.endswith((".mp3",".m4a")):
        audio2data(f)

print('ding!')