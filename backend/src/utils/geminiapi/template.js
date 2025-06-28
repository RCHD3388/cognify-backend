exports.main_template = `Create a learning path for me with the following structure:

main description : <main_description>
tags : [<tag1>, <tag2>, <tag3>]
path 1 :
title : <Title Step 1>
description : <Description 1>
time : <time 1>

path 2 :
title : <Title Step 2>
description : <Description 2>
time : <time 2>

path 3 :
title : <Title Step 3>
description : <Description 3>
time : <time 3>

end_of_path


Here is the information to generate the learning path:
- Main topic: {{topic}}
- Learner level: {{level}}
- Additional prompt: {{additional_prompt}}

Criteria:
- tags should be relevant to the topic and level.
- main_description should be a short paragraph (3 sentences) explaining the overall goal of the learning path.
- title is the title of each learning step.
- description for each step should be about 2 sentences, explaining what needs to be learned or done in that step.
- time is the estimated time to complete each step, expressed in hours or weeks.

Please provide the result in a clean format following the pattern above.`