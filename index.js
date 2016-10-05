(function() {
    'use strict';

    function RepoFactory() {
        return {
            getRepositories: getRepositories
        }

        function getRepositories() {
            return fetch('https://api.github.com/repositories')
                .then(function(response) {
                    return response.json();
                })
                .then(function(json) {
                    return json;
                })
        }
    }

    var Repo = RepoFactory();
    var repos = [];

    activate();

    function activate() {
        return getRepos()
                    .then(displayRepos)
    }

    function getRepos() {
        return Repo.getRepositories()
                   .then(setRepos)
    }

    function setRepos(data) {
        repos = data;
    }

    function displayRepos() {
        var mainDiv = document.getElementById('list')
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

}());
