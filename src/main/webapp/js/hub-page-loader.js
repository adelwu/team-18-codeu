// Get ?hubId=XYZ parameter value
const urlParams = new URLSearchParams(window.location.search);
const parameterHubId = urlParams.get('hubId');

// URL must include ?hubId=XYZ parameter. If not, redirect to hub list.
if (!parameterHubId) {
  window.location.replace('hub-feed.html');
}

/**
 * Requests then displays the user's data if they entered any.
 * Diplays 'This user has not entered any information yet.' otherwise.
*/
function fetchHubInfo(){
  const url = '/hub?hubId=' + parameterHubId;
  fetch(url).then((response) => {
    return response.json();
  }).then((hub) => {
    document.getElementById('page-title').innerText = hub.name;
    document.title = hub.name;

    document.getElementById('hub-image').setAttribute("src", hub.photo);
    document.getElementById('hub-description').appendChild(document.createTextNode(hub.desc));
    document.getElementById('hub-address').appendChild(document.createTextNode(hub.address));
  });
}

/** Fetches reviews and add them to the page. */
function fetchHubReviews() {
  const url = '/reviews?hubId=' + parameterHubId;
  fetch(url).then((response) => {
    return response.json();
  }).then((reviews) => {
    const reviewsContainer = document.getElementById('review-container');
    if (reviews.length == 0) {
      reviewsContainer.innerHTML = '<p>This hub has no reviews yet.</p>';
    } else {
      reviewsContainer.innerHTML = '';
    }
    var sum = 0;
    reviews.forEach((review) => {
      reviewsContainer.appendChild(buildReviewsDiv(review));
      sum += parseInt(review.rating, 10);
    });
    var outputRating = '';
    if(reviews.length > 0){
      outputRating = (sum/reviews.length).toFixed(1) + ' stars';
    }
    else{
      outputRating = 'N/A';
    }
    document.getElementById('hub-average-rating').appendChild(document.createTextNode(
       outputRating));
  });
}

/**
 * Builds an element that displays the review.
 * @param {review} review
 * @return {Element}
 */
function buildReviewsDiv(review) {
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('card-footer');
  userNameNode = document.createElement('a');
  userNameNode.setAttribute("href", "/user-page.html?user=" + review.user);
  userNameNode.appendChild(document.createTextNode(review.user));
  headerDiv.appendChild(userNameNode);
  headerDiv.appendChild(document.createTextNode(' - ' + new Date(review.timestamp)));

  const bodyDiv = document.createElement('div');
  bodyDiv.classList.add('card-body');
  bodyDiv.innerHTML = review.text;

  const hubDiv = document.createElement('div');
  hubDiv.classList.add('card-header');
  hubDiv.appendChild(document.createTextNode(review.rating + ' stars'));

  const reviewDiv = document.createElement('div');
  reviewDiv.classList.add('card');
  reviewDiv.appendChild(hubDiv);
  reviewDiv.appendChild(bodyDiv);
  reviewDiv.appendChild(headerDiv);

  return reviewDiv;
}

/** Fetches data and populates the UI of the page. */
function buildHubPageUI() {
  fetchHubInfo();
  fetchHubReviews();
}
