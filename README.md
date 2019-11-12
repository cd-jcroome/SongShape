# SongShape
## Visualizing Audio Data | E14a final project & beyond.
### Ning Chen | Jasper Croome | Rebecca Lantner

### [SongShape Project Plan](https://docs.google.com/spreadsheets/d/1R20NuE4_8i436W7UDcI2JEcZkzuey5yOXeZ-SYLsBmk/edit#gid=1115838130)
Last Updated 11/12/2019

|Task #|Task Title|Task Owner|Start Date|Due Date|Duration|% of Task Complete|Comments|
| ----------- | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |
|1|**Song Visualization: design unique musical fingerprints**|
|1.1| Brainstorm & gather inspiration|ALL|11/1/19|11/11/19|10|100%||
|1.2|Finalize data requirements: attributes needed for viz, methodology to process audio files|ALL|11/1/19|11/11/19|10|100%||
|1.3|Initial design prototyping (sketches, Tableau)|NC & JC|11/1/19|11/11/19|10|100%||
|1.4|D3 implementation: static point in time song shape|NC|11/6/19|11/18/19|12|20%|NC: I am trying to integrate dynamic effect with the sound wave shapes, so that as the music plays, the corresponding keys are highlighted as their waves increase.
|1.5|D3 implementation: moving song shape (figure out how to play the song & viz simultaneously)|JC & NC|11/12/19|11/26/19|14|5%|JC: I know this needs to utilize onClick and the time field from the data, I'm hoping to either leverage the youtube or spotify API to play the music without the issue of royalties or copyright infringement.
|1.6|Finalize processing of CSV song library|JC|11/1/19|11/26/19|25|50%||
|1.7|Complete initial working draft of viz in D3|NC & JC|11/26/19|11/26/19|0|0%||
|1.8|Iterate on draft viz (design & interactivity)|ALL|11/26/19|12/10/19|14|0%||
|1.9|Apply visualization technique to all songs|JC & NC|11/26/19|12/10/19|14|0%||
|1.10|Complete final visualization|ALL|12/10/19|12/10/19|0|0%||
|2|**Summary Visualization: explore the song viz library**|
|2.1|Decide on view (small multiples? interactive bubble chart? etc.)|ALL|11/6/19|11/11/19|5|90%|RL: current concept is a bubble chart, colored by genre and sized by song count. On genre click, category expands into individual song bubbles; on song click, app routes to that song's viz.\n JC - I like this a lot. We could even build small multiples within the bubbles!
|2.2|Prototype designs (sketches, Tableau)|ALL|11/6/19|11/11/19|5|100%||
|2.3|Gather additional metadata for songs in final library (genre, etc.) if needed|RL|11/11/19|11/18/19|7|0%||
|2.4|D3 implementation|RL|11/14/19|11/26/19|12|0%||
|2.5|Complete initial working draft of viz in D3|RL|11/26/19|11/26/19|0|0%||
|2.6|Iterate on design if needed|ALL|11/26/19|12/5/19|9|0%||
|2.7|Complete final visualization|ALL|12/5/19|12/5/19|0|0%||
|3|**Web App: build out essential backend connections**|||||||
|3.1|Decide on app structure (from user perspective)|ALL|11/9/19|11/14/19|5|50%|JC - I'm a real big fan of scrollytelling| and I think it lends itself well to exploration. I can map this out for you two if you'd like to see what my vision is.
|3.2|Create framework for web app (dynamic routes, etc.)|RL|11/14/19|11/21/19|7|5%||
|3.3|Front end design|NC|11/21/19|11/26/19|5|0%||
|3.4|Complete basic functionality|ALL|11/26/19|11/26/19|0|0%||
|3.5|Complete final web app including D3 visualizations|ALL|12/10/19|12/10/19|0|0%||
|4|**Additional App Functionality: build out nice-to-haves if time allows**|||||||
|4.1|Create user profiles: login| logout| save songs|TBD|11/26/19|12/3/19|7|0%||
|4.2|Create ability for users to upload their own songs|TBD|12/3/19|12/10/19|7|0%||

[Markdown table Generator](http://www.tablesgenerator.com/markdown_tables)
