import librosa
import numpy as np
import pandas as pd
import os.path

#------------------------------------------------------------
#------------------------------------------------------------
class AudioSignal():
    #------------------------------------------------------------
    #------------------------------------------------------------
    def __init__(self):
        self.signalData = None
        self.cqtData = None
        self.cqtAbs = None
        self.pitches = None
        self.magnitude = None

class AudioAnalyzer():
    #------------------------------------------------------------
    #------------------------------------------------------------
    def __init__(self, metaDataPath):
        self.mediaPath = ""

        self.allSignal = AudioSignal()
        self.harmonicSignal = AudioSignal()
        self.percussiveSignal = AudioSignal()

        self.samplingRate = 0.0
        self.duration = 0.0

        self.metaDataPath = metaDataPath
        self.metaData = None

        self.mediaName = None

    #------------------------------------------------------------
    #------------------------------------------------------------
    def Analyze(self, mediaPath):
        self.mediaPath = mediaPath

        temp = os.path.basename(self.mediaPath)
        temp = os.path.splitext(temp) # return (root, ext)
        self.mediaName = temp[0]

        self.allSignal.signalData, self.samplingRate = librosa.load(self.mediaPath)
        print("--> max signal = {0:f}".format(np.amax(self.allSignal.signalData)))
        print("    sampling rate = {0:f}".format(self.samplingRate))

        self.harmonicSignal.signalData, self.percussiveSignal.signalData = librosa.effects.hpss(self.allSignal.signalData)
        print("    max signal harmonic = {0:f}".format(np.amax(self.harmonicSignal.signalData)))
        print("    max signal percussive = {0:f}".format(np.amax(self.percussiveSignal.signalData)))

        self.duration = librosa.core.get_duration(y = self.allSignal.signalData, sr = self.samplingRate)
        print("    duration = {0:f} [s]".format(self.duration))

        # self.allSignal.pitches, self.allSignal.magnitudes = librosa.core.piptrack(y = self.allSignal.signalData, sr = self.samplingRate)
        # print("    pitch max = {0:f}".format(np.amax(self.allSignal.pitches)))
        # print("    pitch min = {0:f}".format(np.amin(self.allSignal.pitches)))
        # print("    magnitude max = {0:f}".format(np.amax(self.allSignal.pitches)))
        # print("    magnitude min = {0:f}".format(np.amin(self.allSignal.pitches)))

        self.metaData = pd.read_csv("../data/metadata.csv")

        self.GenerateDf(self.allSignal, self.mediaName + "_all")
        self.GenerateDf(self.harmonicSignal, self.mediaName + "_harmonic")
        self.GenerateDf(self.percussiveSignal, self.mediaName + "_percussive")

    #------------------------------------------------------------
    #------------------------------------------------------------
    def GenerateDf(self, signalData, name):
        # the number of columns of cqtData is the number of STFT frames
        # this can be verified by idx = librosa.time_to_frames(duration, sr = samplingRate)
        # a cqt data is a complex number, having phase information
        # to get its magnitude np.absolute() needs to be used.
        # fmin: minimum frequency (Hz), starting at 16.35 Hz (C0)
        # n_bins: number of frequency bins, starting at fmin
        # bins_per_octave: 12
        # so the frequency range is C0 ~ C8 (12 x 9 = 108 bins)
        signalData.cqtData = librosa.core.cqt(y = signalData.signalData, fmin = 16.35, n_bins = 108, sr = self.samplingRate)
        signalData.cqtAbsData = np.absolute(signalData.cqtData)

        timeInterval = self.duration / signalData.cqtAbsData.shape[1] # unit: second

        df_cqtData = pd.DataFrame(signalData.cqtAbsData)
        df_metaData = pd.DataFrame(self.metaData)

        df_cqtData = df_metaData.join(df_cqtData)

        df_cqtData = df_cqtData.melt(id_vars = {'octave', 'note_name'}, value_name = 'magnitude')

        df_cqtData = df_cqtData.rename(columns = {"variable" : "note_time"})
        print("    shape = ", df_cqtData.shape)

        df_cqtData = df_cqtData[df_cqtData['magnitude'].astype(np.float64) >= 0.1]

        # convert from frame index to time stamp in millisecond
        df_cqtData["note_time"] = df_cqtData["note_time"] * timeInterval * 1000

        df_cqtData.to_csv(name + "_result.csv", index = False)


#------------------------------------------------------------
#------------------------------------------------------------
if __name__ == "__main__":
     metaDataPath = "../data/metadata.csv"
     aa = AudioAnalyzer(metaDataPath)

     mediaPath = "../data/TheCatConcerto.mp4"
     # mediaPath = "../data/TheCatConcertoDebug.mp3"
     aa.Analyze(mediaPath)


