const axios = require("axios")

module.exports = class Github {

    async authenticate(code) {
        const { data } = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.OAUTH_CLIENT_ID,
            client_secret: process.env.OAUTH_CLIENT_SECRET,
            code,
        });
    
        const accessToken = (data.split("&")[0].split("=")[1]);
        return accessToken;
    }

    async getUser(accessToken) {
        const { data: user } = await axios.get("https://api.github.com/user", {
            headers: {
                "Content-Type": "application/vnd.github+json",
                Authorization: `token ${accessToken}`
            }
        })

        return user;
    }

    async newRepository(repositoryName, accessToken) {
        await axios.post("https://api.github.com/user/repos", {
            name: repositoryName
        }, {
            headers: {
                "Content-Type": "application/vnd.github+json",
                Authorization: `token ${accessToken}`
            }
        })

    }

    async isExistRepository(user, repositoryName, accessToken) {
        try {
            await axios.get(`https://api.github.com/repos/${user.login}/${repositoryName}`, {
                headers: {
                    "Content-Type": "application/vnd.github+json",
                    Authorization: `token ${accessToken}`
                }
            })
            return true;
        } catch (error) {
            return false
        }
    }

    async uploadNewVersionFile(user, repositoryName, filename, shaPreviousVersionFile, content, accessToken) {
        const { data: fileNewVersion } = await axios.put(
            `https://api.github.com/repos/${user.login}/${repositoryName}/contents/${filename}`,
            {
                "message": "commit site conte",
                "committer": {
                    "name": user.login,
                    "email": user.email
                },
                "sha": shaPreviousVersionFile,
                "content": Buffer.from(content, "utf8").toString("base64")
            },
            {
                headers: {
                    "Content-Type": "application/vnd.github+json",
                    Authorization: `token ${accessToken}`
                }
            }
        )

        return fileNewVersion;
    }

    async uploadNewFile(user, repositoryName, filename, content, accessToken) {
        const { data: site } = await axios.put(
            `https://api.github.com/repos/${user.login}/${repositoryName}/contents/${filename}`,
            {
                "message": `create file ${filename} in ${repositoryName}`,
                "committer": {
                    "name": user.login,
                    "email": user.email
                },
                "content": Buffer.from(content, "utf8").toString("base64")
            },
            {
                headers: {
                    "Content-Type": "application/vnd.github+json",
                    Authorization: `token ${accessToken}`
                }
            }
        )

        return site;
    }

    async getFileOfRepository(user, repositoryName, filename, accessToken) {
        try {
            const { data: file } = await axios.get(
                `https://api.github.com/repos/${user.login}/${repositoryName}/contents/${filename}`,
                {
                    headers: {
                        "Content-Type": "application/vnd.github+json",
                        Authorization: `token ${accessToken}`
                    }
                }
            )
    
            return file;
        } catch(error) {
            return null
        }
        
    }

}
