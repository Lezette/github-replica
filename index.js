let repositories = document.querySelector('#repositories');
repositories.innerHTML = '';
const query = `{
    repositoryOwner(login: "Lezette") {
      ... on User {
        repositories(first: 20) {
          edges {
            node {
              name,
              description,
              url,
              forkCount,
              stargazerCount,
              pushedAt,
              languages(first:1) {
                edges {
                  node {
                    name,
                    color
                  }
                }
              },
            }
          }
        }
      }
    }
  }`;

fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${token}`,
    },
    body: JSON.stringify({query: query})
  })
    .then(r => r.json())
    .then(data => {
        const {edges} = data.data.repositoryOwner.repositories;
        console.log('edges', edges);
        const getDate = (date) => {
            let editedDate = new Date(date);
            const day = editedDate.getDate();
            const month = editedDate.getMonth();
            let monthDate = {
                0: 'Jan',
                1: 'Feb',
                2: 'Mar',
                3: 'Apr',
                4: 'May',
                5: 'Jun',
                6: 'Jul',
                7: 'Aug',
                8: 'Sep',
                9: 'Oct',
                10: 'Nov',
                11: 'Dec'
            };

            return `${day} ${monthDate[month]}`;
        }
        edges.forEach(edge => {
            repositories.innerHTML += `
            <section class="repository">
            <div class="repo-info">
                <a href=${edge.node.url} class="title">${edge.node.name}</a>
                <div class="description body">${edge.node.description}</div>
                <div class="info">
                    <div class="language">
                        <span class="color" style="background: ${edge?.node?.languages?.edges[0]?.node?.color}"></span>
                        ${edge?.node?.languages?.edges[0]?.node?.name === undefined ? "" : edge?.node?.languages?.edges[0]?.node?.name}
                    </div>
                    <div class="star">
                        <span class="star"></span>
                        ${edge.node.stargazerCount === 0 ? "": edge.node.stargazerCount}
                    </div>
                    <div class="forks">
                        <span class="forks"></span>
                        ${edge.node.forkCount  === 0 ? "": edge.node.forkCount}
                    </div>
                    <div class="last-updated">
                       Updated on ${getDate(edge.node.pushedAt)}
                    </div>
                </div>
            </div>
            <div class="star-repo">
                <button>
                    <span class="star"></span>
                    Star
                </button>
            </div>
        </section>
            `;
        });
    }).catch(err => {
        repositories.innerHTML += 'Something Went wrong';
        console.log('err', err)
    });
     

    // 5debeecd1d7cf5c2a2771759b1bc20ad0acf1a4a