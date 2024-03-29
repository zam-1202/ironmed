$(document).ready(() => {
    checkSalesToday();
    checkCart();
});

const pos_sales_today = document.querySelector('.pos__head__amount');
const inpCustomerError = document.querySelector('.pos__body__customer__error');
const inpPaymentError = document.querySelector('.pos__insufficient__error');
const inpCustomer = document.querySelector('.pos__body__customer__input');
const inpCustomerNumber = document.querySelector('.pos__body__customer__number');
const posCustomer = document.querySelector('.pos__body__customer');
const posCustomerNumber = document.querySelector('.pos__body__customer_number');
const posForm = document.querySelector('.pos__form');
const inpBarcode = document.querySelector('.pos__form__barcode');
const inpProduct = document.querySelector('.pos__form__product');
const inpDiscount = document.querySelector('.pos__body__discount__input');
const btnConfirm = document.querySelector('.pos__confirm');
const btnCart = document.querySelector('.pos__form__submit');
const btnCheckout = document.querySelector('.pos__form__checkout');
const btnClose = document.querySelector('pos__close');
const posTable = document.querySelector('pos__table');
const posQuantity = document.querySelector('.pos__form__quantity');
const btnConfirmPassword = document.querySelector('.admin__password__button');
const inpAdminPassword = document.querySelector('.admin__password__input');
const posGrandTotal = document.querySelector('.pos__grand__total');

let barcode;
let productCart = [];
let grandTotal = 0;
let container = 0;
let transaction = 0;

var tableConfig = {
    retrieve: true,
    paging: false,
    searching: false,
    ordering: true,
    info: false
};

var unsavedChanges = false;
var hasValues = false;

var initialFieldValues = {};

$(':input').each(function () {
    initialFieldValues[this.id] = $(this).val();
});

$(document).on('input', ':input:not(.dataTables_filter input):not([aria-controls^="DataTables_Table_"])', function () {

    var currentFieldValue = $(this).val();
    var initialFieldValue = initialFieldValues[this.id];

    // console.log('Field ID:', this.id, 'Current Value:', currentFieldValue, 'Initial Value:', initialFieldValue);

    if (this.id !== 'slc_status') {
        if (currentFieldValue !== initialFieldValue) {
            unsavedChanges = true;
            // console.log('Field ID with unsaved changes:', this.id, 'Current Value:', currentFieldValue);
        } else {
            unsavedChanges = false;
        }
    }
});

window.onbeforeunload = function() {
    if (unsavedChanges) {
        return "There are unsaved changes";
    }
};

function showLeaveConfirmation() {
    return Swal.fire({
            title: 'Transaction is in progress',
            text: 'Are you sure you want to leave?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, leave anyway',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No'
    });
}


function resetUnsavedChanges() {
    unsavedChanges = false;
}

function UnsavedChangesTrue() {
    unsavedChanges = true;
}

$(document).on('click', 'a[href]:not([target="_blank"])', function (e) {
    if ($(this).closest('.paginate_button').length === 0) {
        if (unsavedChanges) {
            var nonEmptyInputs = $(':input').filter(function () {
                return this.value.trim() !== '';
            });

            if (nonEmptyInputs.length === 0) {
                resetUnsavedChanges();
                return;
            }

            if ($(this).text().trim().toLowerCase() === 'logout') {
                window.onbeforeunload = null;
                window.location.href = e.target.href;
                return;
            }

            e.preventDefault();
            showLeaveConfirmation().then((result) => {
                if (result.isConfirmed) {
                    resetUnsavedChanges();
                    window.location.href = e.target.href;
                }
            });
        }
    }
});


const printReceipt = (invoiceId) => {
    // window.location.href = ('http://localhost/pos/views/pos/receipt.php?invoice_id=${invoiceId}');
    window.open(`${HOST_2}/views/pos/receipt.php?invoice_id=${invoiceId}`);
}

const checkSalesToday = () => {
    $.ajax({
        type:'get',
        url: INVOICE_CONTROLLER + `?action=getTotalSalesToday`,
        dataType:'json',
        cache: false,
        success: (data) => {
            if(data.total_sales == null){
                data.total_sales = 0;
            }
            pos_sales_today.innerHTML = '₱'+ parseFloat(data.total_sales).toFixed(2);
        }
    });
}

const checkCart = () => {
    console.log('Number of items in the cart:', productCart.length);
    // console.log('Container:', container);
    if (productCart.length === 0) {
        // console.log('Cart is empty. Disabling checkout.');
        btnCheckout.style.backgroundColor = "#808080";
        btnCheckout.disabled = true;
        inpDiscount.setAttribute("disabled", "disabled");
        inpDiscount.checked = false;
        inpCustomerNumber.setAttribute("disabled", "disabled");
        inpCustomer.setAttribute("disabled", "disabled");
        inpDiscount.checked = false;
        inpCustomerNumber.value = "";
        inpCustomer.value = "";
        unsavedChanges = false;
    } else {
        // console.log('Cart has items. Enabling checkout.');
        btnCheckout.style.backgroundColor = "#99FFCC";
        btnCheckout.disabled = false;
        inpCustomerNumber.removeAttribute("disabled");
        inpCustomer.removeAttribute("disabled");
    }
};

const validateAdminPassword = () => {
 var barcode = $('#modal_confirmpassword').data('barcode');
    $.ajax({
        type: 'POST',
        url: USER_CONTROLLER + `?action=validateAdminPassword`,
        data:{
            password:inpAdminPassword.value
        },
        dataType: 'json',
        cache: false,
        success: (result) => {
            if(result == true) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Voided successfully',
                    showConfirmButton: true,
                })
                removeItem(batch)
                $('#modal_confirmpassword').modal('hide');
            }
            else {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Incorrect Password',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    });
    inpAdminPassword.value = "";
}

const confirmVoidCart = (batch, barcode) => {
    console.log('Batch:', batch);
    console.log('Barcode:', barcode);

    if (SessionRole.value == 3) {
        $('#modal_confirmpassword').data('batch', batch);
        $('#modal_confirmpassword').data('barcode', barcode);
        $('#modal_confirmpassword').modal('show');
    } else {
        removeItem(batch, barcode);
    }
}


const removeItem = (batch, barcode) => {
    productCart = productCart.filter((item) => {
        return item.batch !== batch || item.barcode !== barcode;
    });

    const rowClass = `.row${batch}-${barcode}`;
    const table = $('.table').DataTable(tableConfig);

    // Detach event listeners before removing the row
    $('.btn-remove', rowClass).off('click');

    table.rows(rowClass).remove().draw(); // Redraw the DataTable

    // Reattach event listeners after removing the row
    $('.btn-remove').on('click', function() {
        const batch = $(this).data('batch');
        const barcode = $(this).data('barcode');
        confirmVoidCart(batch, barcode);
    });

    container--;
    transaction--;

    // updateFooterVisibility();
    updateGrandTotal();
    checkCart();
}



// const removeItem = (batch) => {
//     productCart = productCart.filter((item) => {
//         return item.batch !== batch;
//     });

//     const rowClass = `.row${batch}`;
//     const table = $('.table').DataTable(tableConfig);

//     table.rows(rowClass).remove().draw(); // Redraw the DataTable

//     container--;
//     transaction--;

//     updateFooterVisibility();
//     updateGrandTotal();
//     checkCart();
// }



// const voidCart = (barcode) => {
//         $.ajax({
//             type: 'GET',
//             url: INVOICE_CONTROLLER + `?action=voidCart`,
//             // type: 'DELETE',
//             data:{
//                 barcode:barcode,
//             },
//             dataType: 'json',
//             cache: false,
//             success: (data) => {
//                 console.log(data);
//             }
//         });
// }


const closeModal = (modal) =>{
    $(`#${modal}`).modal('hide');
}


const calculateDiscount = (amount, discountType) => {
                let discount = 0;
                if(discountType == 'branded'){
                    discount = 0.08;
                }
                else if(discountType == 'generic'){
                    discount = 0.2;
                }
                else{
                    // not discounted
                }
                return amount - (amount * discount);
};

const checkCustomerFields = () => {
    const customerName = inpCustomer.value.trim();
    const customerNumber = inpCustomerNumber.value.trim();

    if (customerName !== '' && customerNumber !== '') {
        inpDiscount.removeAttribute("disabled");
    } else {
        inpDiscount.setAttribute("disabled", "disabled");
        inpDiscount.checked = false; // Uncheck the discount checkbox if customer fields are empty
    }
};

inpCustomer.addEventListener('input', checkCustomerFields);
inpCustomerNumber.addEventListener('input', checkCustomerFields);

// Add this line to check the fields on page load
checkCustomerFields();

const checkDiscount = () => {
    const rows = document.querySelectorAll('tbody tr.rowClass');
    let grandTotalValue = 0;
    let customerName = inpCustomer.value.trim();
    let customerNumber = inpCustomerNumber.value.trim();

    if (customerName === '' || customerNumber === '') {
        inpDiscount.disabled = true;
        inpDiscount.checked = false;
    } else {
        inpDiscount.disabled = false;

        if (rows.length > 0) {
            rows.forEach((row) => {
                const price = row.querySelector('.p-price');
                const quantity = row.querySelector('.p-quantity');
                const amount = row.querySelector('.p-amount');
                const type = row.querySelector('.p-type');
                let amountValue = (+price.innerHTML * +quantity.innerHTML).toFixed(2);

                if (inpDiscount.checked) {
                    console.log('Discount is checked');
                    amountValue = calculateDiscount(amountValue, type.innerHTML).toFixed(2);
                }

                amount.innerHTML = amountValue;
                grandTotalValue += parseFloat(amountValue);
            });
        }
    }

    const grandTotalCell = document.getElementById('grandTotalCell');
    if (grandTotalCell) {
        grandTotalCell.innerHTML = `₱ ${grandTotalValue.toFixed(2)}`;
    }
};

inpDiscount.addEventListener('change', checkDiscount);
posQuantity.addEventListener('click', ()=>{
    posQuantity.classList.remove('error');
});

inpBarcode.addEventListener('click', ()=>{
    inpBarcode.classList.remove('error');
});

inpBarcode.addEventListener('blur', (e)=>{

    if (inpBarcode.value.trim() === '') {
        inpProduct.value = '';
        // unsavedChanges = false;
        return;
    }

    $.ajax({
        type: 'GET',
        url: PRODUCT_CONTROLLER + `?action=getAvailableProductByBarcode&barcode=${inpBarcode.value}`,
        dataType: 'json',
        cache: false,
        success: (data) => {

            if (data.length > 0) {
                inpProduct.value = data[0].product_name;
                unsavedChanges = true;
            
                const totalAvailableQuantity = data.reduce((accumulator, product) => {
                    return accumulator + parseInt(product.quantity);
                }, 0);
            
                if (totalAvailableQuantity === 0) {
                    console.log("Out of stock");
                    Swal.fire({
                        icon: 'error',
                        title: 'Out of Stock',
                        html: `${data[0].product_name} <br>
                        Product is currently out of stock.`,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            inpBarcode.classList.remove('error');
                            inpBarcode.value = '';
                            inpProduct.value = '';
                            posQuantity.value = '';
                            unsavedChanges = false;
                        }
                    });
                } else {
                    // console.log("Product found with available quantity");
                }
            } else {
                console.log("Not found");
                Swal.fire({
                    icon: 'error',
                    title: 'Product Not Found',
                    text: 'It seems like the product that you\'re looking for does not exist.',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        inpBarcode.classList.remove('error');
                        inpBarcode.value = '';
                        inpProduct.value = '';
                        posQuantity.value = '';
                        unsavedChanges = false;
                    }
                });
            }
        }
    });
});

btnCheckout.addEventListener('click', (e)=>{
    e.preventDefault();
    grandTotal = 0;
    subtotal = 0;
    discountAmount = 0;
    totalQuantity = 0;

    console.log(productCart);
    let list = productCart.map(item =>{
        let totalItemPrice = parseInt(item.quantity) * parseFloat(item.price).toFixed(2);

        subtotal += totalItemPrice;
        totalQuantity += parseInt(item.quantity);

        if (inpDiscount.checked) {
            const discountedPrice = calculateDiscount(totalItemPrice, item.type);
            discountAmount += totalItemPrice - discountedPrice;
            totalItemPrice = discountedPrice;
        }
        grandTotal += totalItemPrice;
        
        
        return `<li class="pos__list__item">
            <div class="pos__list__item__details">
            <span class="pos__list__item__quantity">${item.quantity}</span>
            <p class="pos__list__item__name"> ${item.name}</p>
            </div>
            <span class="pos__list__item__price">₱ ${totalQuantity.toFixed(2)}</span>
        </li>`;
    }).join('');

    list += `<li class="pos__list__item total">
        <div class="pos__list__item__details">
            <span class="pos__list__item__quantity">${totalQuantity}</span>
            <p class="pos__list__item__name">Total Items Purchased</p>
        </div>
        <span class="pos__list__item__price" step="0.01"> </span>
    </li>`;

    list+=`<li class="pos__list__item total">
        <div class="pos__list__item__details">
        <span class="pos__list__item__quantity"></span>
        <p class="pos__list__item__name dark">Sub Total</p>
        </div>
        <span class="pos__list__item__price" step="0.01">₱ ${subtotal.toFixed(2)}</span>
    </li>`

    if (inpDiscount.checked){
        list += `<li class="pos__list__item total">
        <div class="pos__list__item__details">
            <span class="pos__list__item__quantity"></span>
            <p class="pos__list__item__name dark">Discount</p>
        </div>
        <span class="pos__list__item__price" step="0.01">₱ ${discountAmount.toFixed(2)}</span>
    </li>`;
    }

    list+=`<li class="pos__list__item total">
        <div class="pos__list__item__details">
        <span class="pos__list__item__quantity"></span>
        <p class="pos__list__item__name dark">Grand Total</p>
        </div>
        <span class="pos__list__item__price" step="0.01">₱ ${grandTotal.toFixed(2)}</span>
    </li>`

    list+=`<li class="pos__list__item payment">
        <div class="pos__list__item__details">
        <span class="pos__list__item__quantity"></span>
        <p class="pos__list__item__name">Payment</p>
        </div>
        <input class="pos__body__payment" min="1" onkeydown="restrictNonNumericInput(event);" oninput="calculateChange();" 
        type="text" step="0.01" maxlength="6"></input>
    </li>`

    list+=`<li class="pos__list__item total">
        <div class="pos__list__item__details">
        <span class="pos__list__item__quantity"></span>
        <p class="pos__list__item__name dark">Change</p>
        </div>
        <span class="pos__list__item__change">₱ 0.00</span>
    </li>`

    $('.pos__list').html(list);

    $('#myModal').addClass('fade').modal('show');
});

$('#grandTotalName').parent().addClass('hidden-footer');
let dataTable = $('.table').DataTable(tableConfig);

function updateFooterVisibility() {
    const footerContainer = $('#grandTotalName').parent();

    if (productCart.length > 0) {
        footerContainer.removeClass('hidden-footer');
    } else {
        footerContainer.addClass('hidden-footer');
    }
}


const updateGrandTotal = () => {
    grandTotal = 0;

    productCart.forEach(item => {
        const totalItemPrice = parseInt(item.quantity) * parseFloat(item.price);
        if (inpDiscount.checked) {
            const discountedPrice = calculateDiscount(totalItemPrice, item.type);
            grandTotal += discountedPrice;
        } else {
            grandTotal += totalItemPrice;
        }
    });

    console.log('Grand Total:', grandTotal);
    
    const grandTotalCell = document.getElementById('grandTotalCell');
    if (grandTotalCell) {
        grandTotalCell.innerHTML = `₱ ${grandTotal.toFixed(2)}`;
    }
};

btnCart.addEventListener('click', (e) => {
    e.preventDefault();
    
    let requiredQuantity = parseInt(posQuantity.value) || 1;
    $.ajax({
        type: 'GET',
        url: PRODUCT_CONTROLLER + `?action=getAvailableProductByBarcode&barcode=${inpBarcode.value}`,
        dataType: 'json',
        cache: false,
        success: data => {
            
            let totalAvailableQuantity = data.reduce((accumulator, product) => {
                return accumulator + parseInt(product.quantity);
            }, 0);

            let totalQuantityInCart = productCart.reduce((accumulator, item) => {
                return accumulator + item.quantity;
            }, 0);

                if (data.length > 0 && totalAvailableQuantity >= totalQuantityInCart + requiredQuantity) {
                const exist = productCart.find(el => el.barcode === data[0].barcode && el.batch === data[0].batch);
                if (exist) {
                    Swal.fire({
                        title: `${data[0].product_name}`,
                        text: 'Item is already on the list. Update the item quantity?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            exist.quantity += requiredQuantity;
                            const updatedAmount = exist.quantity * exist.price;
                            const existingRow = $(`#pos__table tbody .row${exist.batch}-${exist.barcode}`);

                            if (existingRow.length > 0) {
                                existingRow.find('.p-quantity').text(exist.quantity);
                                existingRow.find('.p-amount').text(updatedAmount.toFixed(2));
                            }
                            
                            grandTotal = 0;
                            productCart.forEach(item => {
                                const totalItemPrice = parseInt(item.quantity) * parseFloat(item.price);
                                if (inpDiscount.checked) {
                                    const discountedPrice = calculateDiscount(totalItemPrice, item.type);
                                    grandTotal += discountedPrice;
                                } else {
                                    grandTotal += totalItemPrice;
                                }
                            });
                        
                            $('.table').DataTable().destroy();
                            $('#pos__table').DataTable(tableConfig);
                            container++;
                            checkCart();
                            transaction ++;
                            checkDiscount();
                            posForm.reset();
                            updateGrandTotal();
                        } else {
                            posForm.reset();
                        }
                    });
                } else {
                    const item = {
                        barcode: data[0].barcode,
                        batch: data[0].batch,
                        name: data[0].product_name,
                        price: data[0].sale_price,
                        quantity: requiredQuantity,
                        type:data[0].type
                    }
                    productCart.push(item);
                    checkCart();
    
                    grandTotal = 0;

                    productCart.forEach(item => {
                        const totalItemPrice = parseInt(item.quantity) * parseFloat(item.price);
                        if (inpDiscount.checked) {
                            const discountedPrice = calculateDiscount(totalItemPrice, item.type);
                            grandTotal += discountedPrice;
                        } else {
                            grandTotal += totalItemPrice;
                        }
                    });

                let row = '';

                for (const product of data) {
                    totalAvailableQuantity += product.quantity;
                    if (requiredQuantity > 0) {
                        let availableQuantity = 0;

                        if (requiredQuantity >= product.quantity) {
                            requiredQuantity = requiredQuantity - product.quantity;
                            availableQuantity = product.quantity
                        } else {
                            availableQuantity = requiredQuantity;
                            requiredQuantity = 0;
                        }
                        
                        
                        const typeValue = product.type ? product.type : '-';
                        const amount = product.sale_price * availableQuantity;
                        // const rowClass = `rowClass row${product.batch}`;
                        const rowClass = `rowClass row${product.batch}-${product.barcode}`;

                        
                        row += `<tr class="${rowClass}">
                            <td>

                                <button class="btn-remove" onclick="confirmVoidCart('${product.batch}', '${product.barcode}')">&#10008;</button>

                            </td>
                            <td>${product.barcode}</td>
                            <td>${product.product_name}</td>
                            <td>${product.category_name}</td>
                            <td class="p-type">${typeValue}</td> <!-- Display hyphen if type is empty -->
                            <td>${product.expiration_date}</td>
                            <td>${product.batch}</td>
                            <td class="p-price">${product.sale_price}</td>
                            <td class="p-quantity">${availableQuantity}</td>
                            <td class="p-amount">${amount.toFixed(2)}</td>
                        </tr>`;
                    } else {
                        break;
                    }
                }
                $('.table').DataTable().destroy();
                $('#pos__table tbody').append(row);
                $('.table').DataTable(tableConfig);
                container ++
                transaction ++
                checkDiscount();
                posForm.reset();
                updateGrandTotal();
                checkCart();
                }
            
            } else if (totalAvailableQuantity == totalQuantityInCart) {
                    posQuantity.classList.add('error');
                    Swal.fire({
                        icon: 'info',
                        title: 'Insufficient stock',
                        html: `${data[0].product_name} <br>
                        We only have 0 items left for this product`,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            posQuantity.classList.remove('error');
                            inpBarcode.value = '';
                            inpProduct.value = '';
                            posQuantity.value = '';
                            unsavedChanges = false;
                        }
                    });
            } else if (totalAvailableQuantity < requiredQuantity + totalQuantityInCart && totalAvailableQuantity != 0) {
                posQuantity.classList.add('error');
                Swal.fire({
                    icon: 'info',
                    title: 'Insufficient stock',
                    html: `${data[0].product_name} <br>
                    We only have ${totalAvailableQuantity} items left for this product`,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        posQuantity.classList.remove('error');
                        inpBarcode.value = '';
                        inpProduct.value = '';
                        posQuantity.value = '';
                        unsavedChanges = false;
                    }
                });
            } else if (totalAvailableQuantity === 0) {
                    console.log("Out of stock");
                    Swal.fire({
                        icon: 'error',
                        title: 'Out of Stock',
                        html: `${data[0].product_name} <br>
                        Product is currently out of stock.`,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            inpBarcode.classList.remove('error');
                            inpBarcode.value = '';
                            inpProduct.value = '';
                            posQuantity.value = '';
                            unsavedChanges = false;
                        }
                    }); 
            } else {
                inpBarcode.classList.add('error');
                inpProduct.value = '';
                Swal.fire({
                    icon: 'error',
                    title: 'Product Not Found',
                    text: 'It seems like the product that you\'re looking for does not exist',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        inpBarcode.classList.remove('error');
                        posQuantity.value = '';
                        unsavedChanges = false;
                    }
                });
            }            
            updateFooterVisibility();
        }
    });
});

btnConfirm.addEventListener('click',()=>{
    
    let discount = ''
    let customerName = '';
    let customerNumber = '';
    let cashPayment = $('.pos__body__payment').val();
    let process = 1;

    if (cashPayment.trim() === '') {
        $('.pos__body__payment').addClass('error');
        return;
    } else {
        $('.pos__body__payment').removeClass('error');
    }

    if(inpDiscount.checked){
        discount = 'discounted';
        customerName = inpCustomer.value;
        customerNumber = inpCustomerNumber.value;

        if(customerName == '' || customerNumber == ''){
            process = 0;
        }
    }

    if(cashPayment < grandTotal) {
        process = 2;
    }
    
    if(process == 1){
        $.ajax({
            type: "POST",
            url: INVOICE_CONTROLLER + `?action=confirmedCheckout`,
            dataType: "json",
            data:{
                osca_number: customerNumber, 
                customerName: customerName, 
                cashPayment: cashPayment, 
                data: productCart,
                discounted: discount
            },
            success: function (last_invoice_id) 
            {
                window.onbeforeunload = null;
                console.log('success');
                printReceipt(last_invoice_id);
                window.location.href = HOST_2 + '/views/pos/index.php';
            },
            error: function () {
                console.log('error');
            }
        });
    }
    else if(process == 2){
        inpPaymentError.classList.add('show');
    }
    else{
        $('#myModal').addClass('fade').modal('hide');
        inpCustomerError.classList.add('show');
    }

});

function restrictNonNumericInput(event) {
    const posPayment = document.querySelector('.pos__body__payment');

    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
        return true;
    }

    if ((!isNaN(Number(event.key) && event.key !== '.')) || 
        (event.key === '.' && !posPayment.value.includes('.') && posPayment.value !== '') && 
        event.code !== 'Space') {
        return true;
    }

    event.preventDefault();
    return false;
}


function limitInputLength(element, maxLength) {
    if (element.value.length > maxLength) {
        element.value = element.value.slice(0, maxLength);
    }
}

function calculateChange() {
    const posPayment = document.querySelector('.pos__body__payment');
    let payment = posPayment.value;

    payment = payment.replace(/[^0-9.]/g, '');

    let paymentValue = parseFloat(payment);

    let change = paymentValue - grandTotal;

    if (paymentValue >= grandTotal) {
        inpPaymentError.classList.remove('show');
        posPayment.classList.remove('error');
    } else {
        inpPaymentError.classList.add('show');
        if (!posPayment.classList.contains('error')) {
            posPayment.classList.add('error');
        }
    }

    if (isNaN(paymentValue) || paymentValue === null) {
        inpPaymentError.classList.remove('show');
        posPayment.classList.remove('error');
    }

    if (payment === "") {
        change = 0;
    }
    change = parseFloat(change).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    $('.pos__list__item__change').html(`₱ ${change}`);
}


btnConfirmPassword.addEventListener('click', validateAdminPassword);

var formChanged = false;
// Form warning before leaving
$(document).ready(function() {
    $('form').on('change', function() {
        formChanged = true;
    });

    $('a').on('click', function(e) {
        console.log("test")
        if (transaction == 1) {
            e.preventDefault(); 
            Swal.fire({
                title: 'Transaction is in progress',
                text: 'Are you sure you want to leave?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave anyway',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location = this.href;
                }
            });
        }
    });
    
    $('.cancelButton').on('click', function(e) {
        if (formChanged) {
            e.preventDefault();
            Swal.fire({
                title: 'Transaction is in progress',
                text: 'Are you sure you want to leave?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "../master-page/home.php";
                }
            });
        } else {
            window.location.href = "../master-page/home.php";
        }
    });
});
window.onload = function(){
    document.getElementById("bCode").focus();
}

document.getElementById('bCode').addEventListener('input', function () {
    if (this.value.length > 13) {
        this.value = this.value.slice(0, 13);
    }
});