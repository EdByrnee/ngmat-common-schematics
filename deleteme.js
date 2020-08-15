function makeColumn(name:any, sort:any){


  // Add the sort to the header if true
  if (sort) sort = "mat-sort-header";
  else sort = "";

  let column_text = name;

  return `
    <!-- Position Column -->
    <ng-container matColumnDef="` + name + `">
      <th mat-header-cell *matHeaderCellDef ` + sort  + `mat-sort-header>` + column_text + `</th>
      <td mat-cell *matCellDef="let element">
        <span class='tfg-table-td'>
          {{ element.` + name + ` }} 
        </span>
      </td>
    </ng-container>

    `
}