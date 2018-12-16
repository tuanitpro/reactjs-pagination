import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

const FIRST_PAGE = 'FIRST';
const LAST_PAGE = 'LAST';
const PREV_PAGE = 'PREV';
const NEXT_PAGE = 'NEXT';

const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

class PaginationBasic extends Component {
  constructor(props) {
    super(props);
    const { totalRecords = null, pageLimit = 30, pageNeighbours = 0 } = props;

    this.pageLimit = typeof pageLimit === "number" ? pageLimit : 30;
    this.totalRecords = typeof totalRecords === "number" ? totalRecords : 0;

    this.pageNeighbours = typeof pageNeighbours === "number" ? Math.max(0, Math.min(pageNeighbours, 5)) : 0;

    this.totalPages = Math.ceil(this.totalRecords / this.pageLimit);

    this.state = { currentPage: 1 };
  }

  componentDidMount() {
    this.gotoPage(1);
  }

  gotoPage = page => {
    const { onPageChanged = f => f } = this.props;

    const currentPage = Math.max(0, Math.min(page, this.totalPages));

    const paginationData = {
      currentPage,
      totalPages: this.totalPages,
      pageLimit: this.pageLimit,
      totalRecords: this.totalRecords
    };

    this.setState({ currentPage }, () => onPageChanged(paginationData));
  };

  handleClick = (page, evt) => {
    evt.preventDefault();
    this.gotoPage(page);
  };

  handleMoveLeft = evt => {
    evt.preventDefault();
    this.gotoPage(this.state.currentPage - this.pageNeighbours * 2 - 1);
  };

  handleMoveRight = evt => {
    evt.preventDefault();
    this.gotoPage(this.state.currentPage + this.pageNeighbours * 2 + 1);
  };

  handleFirstPageClick = (evt) => {
    evt.preventDefault();
    this.currentPage = 1;
  }

  handleLastPageClick = (evt) => {
    evt.preventDefault();
    this.currentPage = this.totalPages;
  }

  fetchPageNumbers = () => {
    const totalPages = this.totalPages;
    const currentPage = this.state.currentPage;
    const pageNeighbours = this.pageNeighbours;
    let pageLimit = pageNeighbours;
    let upperLimit, lowerLimit;
    let pages = [];

    lowerLimit = upperLimit = Math.min(currentPage, totalPages);

    for (let b = 1; b < pageLimit && b < totalPages;) {
      if (lowerLimit > 1) {
        lowerLimit--; b++;
      }
      if (b < pageLimit && upperLimit < totalPages) {
        upperLimit++; b++;
      }
    }
    
    pages = range(lowerLimit, upperLimit);

    return [FIRST_PAGE, PREV_PAGE, ...pages, NEXT_PAGE, LAST_PAGE];
  };


  render() {
    if (!this.totalRecords) return null;

    if (this.totalPages === 1) return null;

    const { currentPage } = this.state;
    const pages = this.fetchPageNumbers();
    console.log(pages);
    return (
      <Fragment>
        <nav aria-label="Countries Pagination">
          <ul className="pagination">
            {pages.map((page, index) => {
              if (page === FIRST_PAGE && currentPage > 1) {
                return (
                  <li key={index} className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                    <a href="http:;;" className="page-link" onClick={e => this.handleClick(1, e)}>
                      {page}
                    </a>
                  </li>
                )
              }
              
              if (page === PREV_PAGE && currentPage > 1) {
                return (
                  <li key={index} className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                    <a href="http:;;" className="page-link" onClick={e => this.handleClick(currentPage - 1, e)}>
                      {page}
                    </a>
                  </li>
                )
              }

              if (page === NEXT_PAGE && currentPage<this.totalPages) {
                return (
                  <li key={index} className={`page-item${currentPage === this.totalPages ? " disabled" : ""}`}>
                    <a href="http:;;" className="page-link" onClick={e => this.handleClick(currentPage + 1, e)}>
                      {page}
                    </a>
                  </li>
                )
              }
              if (page === LAST_PAGE && currentPage<this.totalPages) {
                return (
                  <li key={index} className={`page-item${currentPage === this.totalPages ? " disabled" : ""}`}>
                    <a href="http:;;" className="page-link" onClick={e => this.handleClick(this.totalPages, e)}>
                      {page}
                    </a>
                  </li>
                )
              }              
              if (page !== FIRST_PAGE && page !== PREV_PAGE && page !== NEXT_PAGE && page !== LAST_PAGE){
              return (
                <li key={index} className={`page-item${currentPage === page ? " disabled" : ""}`}>
                  <a href="http:;;" className="page-link" onClick={e => this.handleClick(page, e)}>
                    {page}
                  </a>
                </li>
              );
              }
              return (<li></li>);
            })}
          </ul>
        </nav>
      </Fragment>
    );
  }
}

PaginationBasic.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  pageLimit: PropTypes.number,
  pageNeighbours: PropTypes.number,
  onPageChanged: PropTypes.func
};

export default PaginationBasic;
