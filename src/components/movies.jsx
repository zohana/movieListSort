import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listGroup";
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: {
      path: "title",
      order: "asc"
    }
  };

  componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
    this.setState({
      genres, //genres: genres
      movies: getMovies()
    });
  }

  handleDeleteMovie = movie => {
    console.log(movie);
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({
      movies: movies
    });
  };

  handleLikeButton = movie => {
    //console.log(movie);
    const movies = [...this.state.movies];
    //find the index of that object
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = page => {
    //console.log(page);
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    //console.log(genre);
    this.setState({
      selectedGenre: genre,
      current: 1
    });
  };

  handleSort = sortColumn => {
    //console.log(sortColumn.order);
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      currentPage,
      pageSize,
      selectedGenre,
      movies: allMovies,
      sortColumn
    } = this.state;
    const filtered =
      selectedGenre && selectedGenre._id
        ? allMovies.filter(m => m.genre._id === selectedGenre._id)
        : allMovies;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    console.log(filtered.length);

    const movies = paginate(sorted, currentPage, pageSize);
    //console.log(movies);

    return {
      totalCount: filtered.length,
      data: movies
    };
  };

  render() {
    //console.log(this.state.movies);
    const { length: count } = this.state.movies;
    const { currentPage, pageSize, sortColumn } = this.state;

    if (count === 0) return <p>There are no movies in the database</p>;

    const { totalCount, data: movies } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <p className="h3">Movie List</p>
          <p>Showing {totalCount} movies in the database.</p>
          {/* <p>{count === 0 && "No movies found"}</p> */}
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLikeButton}
            onDelete={this.handleDeleteMovie}
            onSort={this.handleSort}
          />

          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
