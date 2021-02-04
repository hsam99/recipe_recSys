import pymysql
import pandas as pd
import json
import time

start_time = time.time()
# Connect to the database
connection = pymysql.connect(host='localhost',
                             user='sam',
                             password='user@123',
                             db='recipe_db')

# create cursor
cursor=connection.cursor()

with open('./weighted_title_vec2.json', 'r') as f:
    data = json.load(f)

data_df = pd.DataFrame(data)
data_df = data_df.applymap(str)

# creating column list for insertion
cols = "`,`".join([str(i) for i in data_df.columns.tolist()])

# Insert DataFrame recrds one by one.
for i,row in data_df.iterrows():

    sql = "UPDATE recipe_embeddings set weighted_title_vec='{}' where `index`={}".format(row['weighted_title_vec'], i+1)
    # sql = "INSERT INTO `recipe_embeddings` (`" +cols + "`) VALUES (" + "%s,"*(len(row)-1) + "%s)"
    cursor.execute(sql)

    # the connection is not autocommitted by default, so we must commit to save our changes
    connection.commit()

# cols = "`,`".join([str(i) for i in list(data[0].keys())])

# for i in range(len(data)):
#     sql = "INSERT INTO `recipe_details` (`" + cols + "`) VALUES ("
#     for key, value in data[i].items():
#         if key == 'title':
#             value = value.replace('"', "'")
#         sql += "'" + json.dumps(value) + "'," if type(value) == type([]) else '"' + value + '",'
#     sql = sql[:-1]
#     sql += ")"
#     cursor.execute(sql)
#     # the connection is not autocommitted by default, so we must commit to save our changes
#     connection.commit()

connection.close()
elapsed_time = time.time() - start_time
print('Elapsed_time: {}'.format(time.strftime("%H:%M:%S", time.gmtime(elapsed_time))))
# import the module
# from sqlalchemy import create_engine

# # create sqlalchemy engine
# engine = create_engine("mysql+pymysql://{user}:{pw}@localhost/{db}"
#                        .format(user="sam",
#                                pw="user@123",
#                                db="recipe_db"))

# data_df.to_sql('recipe_details', con = engine, if_exists = 'append', chunksize = 1000)