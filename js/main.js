/********************************************************************************* * 
 * WEB422 – Assignment 2
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source 
 * (including web sites) or distributed to other students.
 * 
 * Name: Yevgeniya Anasheva Student ID: 119338192 Date: 2020-06-13
 * ********************************************************************************/

let saleData = [];
let page = 1;
const perPage = 10;

let saleTableTemplate = _.template(`<% sales.forEach(function(sale){ %>
                                        <tr data-id=<%- sale._id %>>
                                            <td> <%- sale.customer.email %> </td>
                                            <td> <%- sale.storeLocation %> </td>
                                            <td> <%- sale.items.length %></td>
                                            <td> <%- moment.utc(sale.saleDate).local().format('LLLL') %> </td>
                                        </tr>
                                    <% }); %>
                                    `);

let saleModelBodyTemplate = _.template(`<h4>Customer</h4>
                                        <strong>email:</strong> <%- sale.customer.email %> <br>
                                        <strong>age:</strong> <%- sale.customer.age %> <br>
                                        <strong>satisfaction:</strong> <%- sale.customer.satisfaction %> / 5
                                        <br><br>
                                        <h4> Items: $<%- sale.total.toFixed(2) %> </h4>
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>Product Name</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <% sale.items.forEach(function(item){  %>
                                                    <tr>
                                                        <td> <%- item.name %> </td>
                                                        <td> <%- item.quantity %> </td>
                                                        <td> $<%- item.price %> </td>
                                                    </tr>
                                                <% }); %>
                                            </tbody>
                                        </table>
`);


function loadSaleData(){
    fetch(`https://sales-api-test.herokuapp.com/api/sales?page=${page}&perPage=${perPage}`).then(res=>res.json()).then(result=>{
        saleData = result;
        let tableData = saleTableTemplate({sales: saleData});
        $("#sale-table tbody").html(tableData);
        $("#current-page").html(page);
    });
};

$(function(){

    loadSaleData();

    //next page event
    $("#next-page").on("click", function(e){
        page += 1;
        loadSaleData();
    });

    //previous page event
    $("#previous-page").on("click", function(e){
        if(page > 1) {
            page -= 1;  //limiting at 0
        }   
        loadSaleData();
    });

    $("#sale-table tbody").on("click", "tr", function(){

        let saleId = $(this).attr("data-id");   //get the id of the clicked sale
        let sale = _.find(saleData, ['_id', saleId]); //get the clicked sale

        //calculate the total price
        sale.total = 0;
        for (let i = 0; i < sale.items.length; i++)
            sale.total += sale.items[i].price * sale.items[i].quantity;

        let modalData = saleModelBodyTemplate({sale: sale});    //get the data for the modal window

        $("#sale-modal .modal-title").html(`Sale: ${saleId}`);  //insert the id in title
        $("#sale-modal .modal-body").html(modalData);   //insert the data in the modal window

        $("#sale-modal").modal({
            backdrop: 'static', // disable clicking on the backdrop to close
            keyboard: false // disable using the keyboard to close
        });
    });
});