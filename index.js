(function() {
    'use strict';

    function RepoFactory() {
        return {
            getPublicRepos: getPublicRepos,
            getUserRepos: getUserRepos,
            createRepo: createRepo
        }

        function getPublicRepos() {
            return fetch('https://api.github.com/repositories')
                .then(function(response) {
                    return response.json();
                })
                .then(function(json) {
                    return json;
                })
        }

        function getUserRepos() {
            return fetch('https://api.github.com/users/lukeghenco/repos')
                .then(function(response) {
                    return response.json();
                })
                .then(function(json) {
                    return json;
                })
        }

        function createRepo(data) {
            console.log(data)
            return fetch('https://api.github.com/user/repos', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'token ' + data.token
                },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description
                })
            })
        }
    }

    var Repo = RepoFactory();
    var repos = [];
    var showMyRepos = true
    var showPublicRepos = true
    var form;
    var publicReposButton;
    var myReposButton;
    var currentRepoType;


    document.addEventListener('DOMContentLoaded', function() {
        // load form listener
        form = document.querySelector('form');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            submitForm();
        })

        // give public repos button an event listener
        publicReposButton = document.getElementById('public-repos')
        publicReposButton.addEventListener('click', function(event) {

            event.preventDefault();

            if (showPublicRepos) {
                showPublicRepos = !showPublicRepos
                getRepos('public-repo-list')
            } else {
                showPublicRepos = !showPublicRepos
                removeRepos()
            }


        })

        // give my repos button an event listener
        myReposButton = document.getElementById('my-repos')
        myReposButton.addEventListener('click', function(event) {

            event.preventDefault();

            if (showMyRepos) {
                showMyRepos = !showMyRepos
                getRepos('my-repo-list')
            } else {
                showMyRepos = !showMyRepos
                removeRepos()
            }

        })
    });

    function getRepos(type) {
        currentRepoType = type
        if (type === 'my-repo-list') {
            return Repo.getUserRepos()
                       .then(setRepos)
        } else if (type === 'public-repo-list') {
            return Repo.getPublicRepos()
                       .then(setRepos)
        }

    }

    function setRepos(data, type) {
        repos = data;
        displayRepos();
    }

    function submitForm() {
        var info = form.querySelectorAll('input[name]');

        var formData = {}
        for (var i = 0; i < info.length; i++) {
            formData[info[i].name] = info[i].value;
        }

        Repo.createRepo(formData)
    }

    function displayRepos() {
        var mainDiv = document.getElementById(currentRepoType)
        repos.map(function(repo) {
            var div = document.createElement('div')
            var h1 = document.createElement('h1')
            var p = document.createElement('p')
            var pText = document.createTextNode(repo.html_url)
            var h1Text = document.createTextNode(repo.name)
            div.className += "list-item"
            h1.appendChild(h1Text)
            p.appendChild(pText)
            div.appendChild(h1)
            div.appendChild(p)
            mainDiv.appendChild(div)
        })
    }

    function removeRepos() {
        var mainDiv = document.getElementById(currentRepoType)
        while (mainDiv.firstChild) {
            mainDiv.removeChild(mainDiv.firstChild)
        }
    }

}());
