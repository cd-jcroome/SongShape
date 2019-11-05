import pandas as pd
import numpy as np
import librosa

import csv
from os import listdir
from os.path import isfile, join, splitext

# for all of the audio files in a given folder...
# songs_folder = input("where are the songs? (hit enter if they're in the same folder)\n")
songs_folder = 'mp3_m4a'

files = [f for f in listdir('./songs/'+songs_folder+'/') if (isfile(join('./songs/'+songs_folder+'/',f)) and f.endswith(('.m4a','.mp3')))]
print(files)

def audio2data(path):
    notes = pd.read_csv('./midi_metadata.csv')

    # use librosa to analyze file
    print('analyzing {}...'.format(f))
    y, sr = librosa.load('./songs/'+songs_folder+'/'+path)

    #split out the harmonic and percussive audio
    y_harmonic, y_percussive = librosa.effects.hpss(y)

    #map out the values into an array
    cqt_h = np.abs(librosa.cqt(y_harmonic, sr=sr, n_bins=128, fmin=6, bins_per_octave=12))

    # make the dataframes
    c_df = pd.DataFrame(notes).join(pd.DataFrame(cqt_h),lsuffix='n').melt(id_vars={'MIDI Note', 'Octave', 'Note'})
    c_df_summary_1 = c_df.groupby(['MIDI Note']).mean().drop(columns='Octave')
    c_df_summary_2 = c_df.groupby(['MIDI Note']).median()
    c_df_summary = c_df_summary_1.join(c_df_summary_2,on=['MIDI Note'],lsuffix='_mean').rename(columns={'value_mean':'Mean','value':'Median'})
    # convert to csv
    print('...converting {} to CSV...'.format(f))
    m_csv = join('./output/librosa_128/',splitext(f)[0],'.csv').replace("/.csv",".csv")
    m_summ_csv = join('./output/librosa_128/',splitext(f)[0],'.csv').replace("/.csv","_summ.csv")
    c_df.to_csv(m_csv)
    c_df_summary.to_csv(m_summ_csv)
    print('{} completed!'.format(f))
## convert midifile to pandas df
for f in files:
    if f.endswith((".mp3",".m4a")):
        audio2data(f)

print('ding!')