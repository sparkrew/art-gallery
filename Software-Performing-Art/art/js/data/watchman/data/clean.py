import pandas as pd

df = pd.read_csv("suicide_statistics.csv")
# df = df.dropna(subset=['suicides_no'])
# df['suicides_no'] = df['suicides_no'].astype(int)
# result = df.groupby(['year', 'sex', 'age'])['suicides_no'].sum().reset_index()
# print(result)
# result.to_csv("suicides_stats_clean.csv", index=False)



# df = df.dropna(subset=['suicides_no'])
# df['suicides_no'] = df['suicides_no'].astype(int)
# result = df.groupby(['age'])['suicides_no'].sum().reset_index()
# result = result.sort_values(by='suicides_no', ascending=False)
# print(result)
# #         age  suicides_no
# #  35-54 years      2895388
# #  55-74 years      1958468
# #  25-34 years      1367333
# #  15-24 years       984287
# #    75+ years       757667
# #   5-14 years        63312

# df = df.dropna(subset=['suicides_no'])
# df['suicides_no'] = df['suicides_no'].astype(int)
# result = df.groupby(['sex'])['suicides_no'].sum().reset_index()
# print(result)
# #         sex  suicides_no
# #  female      1902272
# #  male        6124183