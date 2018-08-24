[![Amphere](https://amphere.in/assets/amphere-text.svg)](https://amphere.in/)

# Amphere Solutions Website

This is the remote repository of Amphere Solutions' offical website and online booking app.
The owners of this website are **Mr. Ibad Rather** and **Mr. Puneet Malhotra**.
Originally written by **[zrthxn]()**.
<br><br>

> ### WARNING<br>
> *This is a proprietary repository!* All code hosted here belongs to Amphere Solutions Inc. Please contact the owners before cloning, forking or downloading.

Visit www.amphere.in <br>
Contact the owners at hello@amphere.in

Please report all issues to the active developers first before opening an issue on Github. Please verify the operation of all pull requests. The repository managers won't have time to check the same before merging.
<br><br>

## Developer Guide
This website is available at www.amphere.in<br>
Hosting is provided by Digital Ocean. You will need to have the SSH keys and an SSH Client to access the server. Also, you need to be added to this repository as a collaborator to be able to push to it.<br>
You need have Git installed. If not, download and install it from [Git](https://git-scm.com).
<br><br>

### Server Access
Remote Server IP address : **139.59.26.79**<br>
SSH Access port : **22**<br>
*Please obtain login credentials from the owners.*
<br><br>

### Clone this Repo
In order to clone this repository to your system, run the following command in Git Bash or any terminal window. 
 ```
 $ git clone https://github.com/amphere-solutions/amphere-web.git
 ```
<br>
 
 ### Add this Repo to remote
Add a remote token with any name you want (we will use 'origin').<br>
Replace 'origin' with what you prefer. 
 ```
 $ git remote add origin https://github.com/amphere-solutions/amphere-web.git
 ```
 After adding, verify be running this...
 ```
 $ git remote -v
 ```
 You should see the following output.
 ```
 > origin  https://github.com/amphere-solutions/amphere-web.git (fetch)
 > origin  https://github.com/amphere-solutions/amphere-web.git (push)
 ```
 <br>
 
 ### Push to this Repo
To update the code on the repo, you should create a branch on this repository with **ampdev-<your_name>** as the branch name. For example: **ampdev-sadiq**<br>
This will help the administrator identify the developers who made the changes. You can use this branch to upload your local version of this repository to. To push to your branch, run the following line...
 ```
 $ git push origin <branch>
 ```
 For example
 ```
 $ git push origin ampdev-sadiq
 ```
 
After you have uploaded your version of the code, you can add a pull request to the branch to notify the administrator to pull from your branch.
> **PLEASE NOTE**<br>
> It is your responsibility as a developer to check the code that you are uploading for mistakes, errors, bugs etc.
> The administrator will not check the repository for errors before uploading to the server.<br>
> *Mistakes are allowed. Laziness isn't.*

**Please DO NOT force push to the master branch without permission**

 ```
 [DON'T DO THIS]
 $ git push origin master -f
 ```
 <br>
 
## Contact
Contact the owners at hello@amphere.in or visit www.amphere.in.<br>
 
*Originally writted by Alisamar Husain on 24/8/2018*<br>
**Last Updated : 24/8/2018**