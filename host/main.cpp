#include<stdio.h>
#include<string.h>
#include <fstream>
#include"rapidjson/document.h"
#include<direct.h>

using namespace std;
void sendMessage(const char *message);
int main()
{
    unsigned int length = 0;
    //read the first four bytes (=> Length)
    for (int i = 0; i < 4; i++){
        length += getchar();
    }
    //read the json-message
    string message = "";
    for (int i = 0; i < length; i++){
        message += getchar();
    }

    rapidjson::Document d;
    d.Parse<0>(message.c_str());
    string oldPath = d["oldPath"].GetString();
    string newPath = d["newPath"].GetString();
    string fileType = d["type"].GetString();
    string fileName = d["name"].GetString();

    // make the new directory
    _mkdir(newPath.c_str());

    string modifiedPath =  newPath + "\\" + fileType;
    _mkdir(modifiedPath.c_str());

    string organizedPath = modifiedPath + "\\" + fileName;

    if(rename(oldPath.c_str(),organizedPath.c_str()) == 0){
        char message[] = "{\"text\": \"SUCCESS\"}";
         sendMessage(message);
    }else{
         remove(oldPath.c_str());
         char message[] = "{\"text\": \"FAIL\"}";
         sendMessage(message);
    }
    return 0;
}

void sendMessage(const char *message){
    unsigned int len = strlen(message);
    printf("%c%c%c%c", (char) (len & 0xff),
                       (char) ((len>>8) & 0xFF),
                       (char) ((len>>16) & 0xFF),
                       (char) ((len>>24) & 0xFF));
    printf("%s", message);
}
