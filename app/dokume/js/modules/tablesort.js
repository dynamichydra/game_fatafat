var DM_TABLESORT = (function() {

  function initSort(selector) {
    var filter = document.querySelectorAll('#' + selector + ' th');
    var idx = 0;
    for (i = 0; i < filter.length; ++i) {
      console.log(i, filter[i]);
      filter[i].onclick = function() {
        sortTable(idx, selector, this);
      };

      console.log(filter[i].onclick);
      idx++;
    }
  }

  function sortTable(n, tableSelector, clickedElement) {

    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(tableSelector);
    switching = true;
    // Set the sorting direction to ascending:
    dir = 'asc';
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.getElementsByTagName("TR");
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == 'asc') {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch= true;
            break;
          }
        } else if (dir == 'desc') {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch= true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is 'asc',
        set the direction to 'desc' and run the while loop again. */
        if (switchcount == 0 && dir == 'asc') {
          dir = 'desc';
          switching = true;
        }
      }
    }

    //show sorting direction
    var filter = table.querySelectorAll('th');
    for (i = 0; i < filter.length; ++i) {
      filter[i].classList.remove('sorted_asc');
      filter[i].classList.remove('sorted_desc');
    }

    if (clickedElement) {
      clickedElement.classList.add('sorted_' + dir);
    }

    localStorage.setItem('LAST_TABLE_SORT', JSON.stringify({
      n: n, tableSelector: tableSelector, dir: dir
    }));
  }

  function setInitSort() {
    var last_sort_order = localStorage.getItem('LAST_TABLE_SORT');
    if (!last_sort_order) return false;

    last_sort_order = JSON.parse(last_sort_order);

    if ($('#' + last_sort_order.tableSelector).length < 1) {
      return false;
    }
    if (el(last_sort_order.tableSelector).value) return false;

    sortTable(last_sort_order.n, last_sort_order.tableSelector, $(`#${last_sort_order.tableSelector} th:nth-child(${parseInt(last_sort_order.n) + 1})`).get(0));

    // if sortorder = desc we have to sort twice
    if (last_sort_order.dir === 'desc') {
      sortTable(last_sort_order.n, last_sort_order.tableSelector, $(`#${last_sort_order.tableSelector} th:nth-child(${parseInt(last_sort_order.n) + 1})`).get(0));
    }
  }

  function initTableSearch(selector, filterRowsSelector) {
    $(selector).on('keyup', function() {
      var value = $(this).val().toLowerCase();
      $(filterRowsSelector).filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  }

  return {
    initTableSearch: initTableSearch,
    initSort: initSort,
    sortTable: sortTable,
    setInitSort: setInitSort
  }
})();
