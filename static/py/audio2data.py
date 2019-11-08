import pandas as pd
import numpy as np
import librosa

import csv
from os import listdir
from os.path import isfile, join, splitext

# for all of the audio files in a given folder...
# songs_folder = input("where are the songs? (hit enter if they're in the same folder)\n")
songs_folder = 'mp3_m4a'

files = [f for f in listdir('../../songs/'+songs_folder+'/') if (isfile(join('../../songs/'+songs_folder+'/',f)) and f.endswith(('.m4a','.mp3')))]
print(files)

def audio2data(path):
    notes = pd.read_csv('../data/midi_metadata.csv')

    # use librosa to analyze file
    print('analyzing {}...'.format(f))
    y, sr = librosa.load('../../songs/'+songs_folder+'/'+path)

    #split out the harmonic and percussive audio
    y_harmonic, y_percussive = librosa.effects.hpss(y)

    #map out the values into an array
    cqt_h = np.abs(librosa.cqt(y_harmonic, sr=sr, n_bins=128, fmin=6, bins_per_octave=12))
    cqt_p = np.abs(librosa.cqt(y_percussive, sr=sr, n_bins=128, fmin=6, bins_per_octave=12)) 

    # make the dataframes
    c_df = pd.DataFrame(notes).join(pd.DataFrame(cqt_h),lsuffix='n').melt(id_vars={'MIDI Note', 'Octave', 'Note'}).rename(columns={'variable':'time'})
    c_df_h = pd.DataFrame(notes).join(pd.DataFrame(cqt_h),lsuffix='n').melt(id_vars={'MIDI Note', 'Octave', 'Note'}).rename(columns={'variable':'time'})
    c_df_p = pd.DataFrame(notes).join(pd.DataFrame(cqt_p),lsuffix='n').melt(id_vars={'MIDI Note', 'Octave', 'Note'}).rename(columns={'variable':'time'})
    
    # harmonic summary
    c_df_h_summary_1 = c_df_h.groupby(['Note', 'Octave']).mean()
    c_df_h_summary_2 = c_df_h.groupby(['Note', 'Octave']).count().drop(columns=['MIDI Note'])
    
    # percussive summary
    c_df_p_summary_1 = c_df_p.groupby(['Note', 'Octave']).mean()
    c_df_p_summary_2 = c_df_p.groupby(['Note', 'Octave']).count().drop(columns=['MIDI Note'])
   
    # join all summaries together
    c_df_h_summary = c_df_h_summary_1.join(c_df_h_summary_2,lsuffix='_mean').rename(columns={'value_mean':'Mean','value':'Count'})
    c_df_p_summary = c_df_p_summary_1.join(c_df_p_summary_2,lsuffix='_mean').rename(columns={'value_mean':'Mean','value':'Count'})
   
    c_df_summary = c_df_h_summary.join(c_df_p_summary, lsuffix='_h', rsuffix='_p').drop(columns={'MIDI Note_p','time_p','Count_p','time_h','Count_h'}).rename(columns={'MIDI Note_h':'MIDI Note','Mean_h':'Harmonic Mean','Mean_p':'Percussive Mean'})


    # filter down the dfs
    c_df_h_final = c_df_h[c_df_h['value'].astype(float)>=.1]
    c_df_p_final = c_df_p[c_df_p['value'].astype(float)>=.1]

    # convert to csv
    print('...converting {} to CSV...'.format(f))
    m_h_csv = join('../../output/librosa_128/',splitext(f)[0],'.csv').replace("/.csv","_h.csv")
    m_p_csv = join('../../output/librosa_128/',splitext(f)[0],'.csv').replace("/.csv","_p.csv")
    m_summ_csv = join('../../output/librosa_128/',splitext(f)[0],'.csv').replace("/.csv","_summ.csv")
    
    c_df_h_final.to_csv(m_h_csv)
    c_df_p_final.to_csv(m_p_csv)
    c_df_summary.to_csv(m_summ_csv)

    print('{} completed!'.format(f))
## convert midifile to pandas df
for f in files:
    if f.endswith((".mp3",".m4a")):
        audio2data(f)

print('ding!')