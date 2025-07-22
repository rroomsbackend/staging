export default (getPropertyDetail) => {
    return `
 <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to RRooms!</title>
</head>

<body style="font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #f4f4f4;">

    <table cellspacing="0" cellpadding="0" border="0"
        style="width: 100%;max-width: 700px;margin: auto;background-color: #ffffff;">
        <tr>
            <td style="background-color: #222; text-align: left; padding: 20px;">
                <img alt="RRooms Logo" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px;">
            </td>
        </tr>
        <tr>
            <td style="background-color: #ffffff; text-align: left; padding: 20px;">
                <h2
                    style="border-bottom:1px solid #000; text-align:center; padding-bottom:20px; font-size: 24px;color: #333;margin-bottom: 10px;">
                    Hotal Partner Agreement
                </h2>
                <p style="font-size: 16px;line-height: 1.6;color: #333;">This Patron Agreement (“Agreement”) is made and
                    executed on the Effective Date by and between:</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>RROOMS</strong>, a company incorporated under the laws of
                    India and having its registered office at B2-1409, DLF Mypad, Vibhuti Khand, Gomti Nagar,
                    Lucknow-226010, Uttar Pradesh, (hereinafter referred to as “Company”, which expression shall, unless
                    repugnant to the meaning or context thereof, be deemed to include its permitted successors and
                    assigns) of the FIRST PART;</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;">AND</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;">
                    <strong>${getPropertyDetail.name}(${getPropertyDetail.propertyCode}), ${getPropertyDetail.address} with
                        ${getPropertyDetail.noOfRooms} rooms</strong> (hereinafter referred to as “Patron”, which
                    expression shall, unless
                    repugnant to the meaning or context hereof, be deemed to include its permitted successors and
                    assigns) of the OTHER PART.
                </p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;">The Company and the Patron are individually
                    referred to as “Party” and collectively referred to as
                    “Parties” hereinafter.</p>

                <h3 style="font-size: 20px; margin-top: 20px; color: #333;">WHEREAS :</h3>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>A.</strong> The Company owns and
                    operates a website ‘www.rrooms.in’, a mobile app ‘RROOMS’
                    and shall be deemed to include any other software, website, application, or product as may be made
                    available by the Company to its Users from time to time (collectively referred to as “Platform”
                    hereinafter), wherein it facilitates the engagement of Users with the Patron for reserving
                    Accommodations.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>B.</strong> Patron is in the business
                    of providing Accommodations and has represented to the
                    Company that it has the necessary legal, technical, and business setup to provide Accommodations on
                    the Platform for booking by Users, on the terms and conditions set out in this Agreement.</p>

                <h3 style="font-size: 20px; margin-top: 20px; color: #333;">NOW, THEREFORE, THE PARTIES DO HEREBY AGREE
                    AS FOLLOWS:</h3>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">1. DEFINITIONS</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.1</strong> “Acceptance” shall mean
                    Patron’s affirmative action on filling its information
                    in this Agreement and agreeing to the terms and conditions set out hereunder by clicking the
                    ‘Accept/Agree’ button;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.2</strong> “Accommodation(s)” means
                    hotel room(s) or any similar accommodation available to
                    be rented by Users through the Platform for such durations as may be set out on the Platform;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.3</strong> “Working Day” means any
                    day, other than a Sunday or a day which is public bank
                    holidays in India or in any other territory where the obligation under this Agreement is being
                    fulfilled;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.4</strong> “Control” (including, with
                    its correlative meanings, the term “under common
                    Control with”) with respect to any person, means: (i) the possession, directly or indirectly, of the
                    power to direct or cause the direction of the management and policies of such person whether through
                    the ownership of voting securities, by agreement or otherwise or the power to elect more than
                    onehalf of the directors, partners or other individuals exercising similar authority with respect to
                    such person; or (ii) the possession, directly or indirectly, of a voting interest of more than 50%
                    (Fifty percent) in such person or (iii) the possession of a such number of securities in such Person
                    which, on a fully diluted basis reflect more than 50% (Fifty percent) of the total paid-up equity
                    share capital of that subject person;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.5</strong> “Customer Satisfaction
                    Index” means an index provided on the Platform for Users
                    to submit their feedback and reviews with regards to Accommodation and services provided by the
                    Patron;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.6</strong> “Effective Date” shall
                    mean the date of Acceptance of this Agreement by the
                    Patron;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.7</strong> “RROOMS Extranet” means
                    the Company’s proprietary software licensed to the
                    Patron to manage the Inventory etc.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.8</strong> “Inventory” means number
                    of Accommodations provided by Patron for listing on the
                    Platform;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.9</strong>
                    “Listing information” means description and information about the Accommodations, including but not
                    limited to the name and location of Accommodations, the amenities attached to such Accommodations,
                    other services available to the User in premises of the Patron, images of the Accommodation, the
                    check-in policy, the cancellation and refund policy with regards to such Accommodation, customer
                    review, etc.;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.10</strong> “Person” means and
                    includes any individual, legal entity, company, body
                    corporate, partnership firm, association, Hindu undivided family, trust, society, limited liability
                    partnership or proprietorship, whether incorporated or not;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.11</strong> “Rate Parity” shall mean
                    the standards of the Accommodation, including but not
                    limited to the room type, dates, bed type, number of guests, policies such as breakfast, reservation
                    charges, and cancellation policy, as are maintained by the Patron on third-party websites, apps or
                    callcenters (including the customer reservation system), or directly at the Accommodation, with any
                    competitor of the Company (including any online or offline reservation or booking agency or
                    intermediary) and/or with any other third party that is a business partner of or in any other way
                    related with or connected to the Patron;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.12</strong> “Term” means the term of
                    this Agreement as per Clause 3.1below;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>1.13</strong> “User” means any Person
                    using the Platform, including any customers or guests
                    of the Company, to make bookings or reservations of Accommodation listed on the Platform.</p>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">2. GENERAL TERMS AND CONDITIONS</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>2.1 UNDERSTANDING OF THE
                        PARTIES</strong> During the Term and for the consideration set out
                    herein, Patron shall commit to the Company a minimum number of Accommodations as may be required to
                    be maintained as Inventory on RROOMS Extranet.</p>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">3. TERM, RENEWAL, TERMINATION</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>3.1 Term</strong> This Agreement shall
                    be deemed to have come into effect on and from the
                    Effective Date and shall continue to be valid unless terminated as per Clause 3.2 below.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>3.2 Termination</strong> This Agreement
                    shall be deemed to have come into effect on and from
                    the
                    Effective Date and shall continue to be valid unless terminated as per Clause 3.2 below.</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>3.2.1</strong> This Agreement shall be
                    deemed to have come into effect on and from the
                    Effective Date and shall continue to be valid unless terminated as per Clause 3.2 below.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>3.2.2</strong> This Agreement shall be
                    deemed to have come into effect on and from the
                    Effective Date and shall continue to be valid unless terminated as per Clause 3.2 below.</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>a</strong>
                    This Agreement may be terminated by the Company by serving a written notice of 30 (Thirty) Working
                    Days in the following instances:</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>b</strong>
                    Patron’s inability to offer any Accommodation for which booking has been confirmed, up to 5 (five)
                    such instances;</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>c</strong>
                    Patron has failed to maintain Rate Parity in regards to Inventory provided;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>d</strong>
                    in the event of multiple escalations from Users against the Patron and persistent low rating on
                    Customer Satisfaction Index;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>e</strong>
                    bankruptcy or winding-up proceedings against the Patron;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>f</strong>
                    Change of Control of the Patron. Patron shall duly intimate Company of any change of Control within
                    15 (fifteen) Working Days of such change taking effect.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>3.2.3</strong> In the event of breach
                    other than as set out in Clause 3.2.2 above, the
                    Company may terminate this Agreement by serving a written notice of 30 (Thirty) Working Days upon
                    the Patron, where the Patron fails to cure such breach within 15 (Fifteen) Working Days after
                    receiving written notice.</p>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">4. CONSIDERATION</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>4.1</strong> The Patron shall pay such
                    commission to the Company as may be mutually agreed to
                    between the Parties. Such commission may be a certain percentage of the Accommodation booking price
                    as stated in RROOMS Extranet, for each confirmed booking. Such cumulative consideration
                    (“Consideration”) shall be paid by the Patron on a monthly basis.</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>4.2</strong> The Company shall raise an
                    invoice for the Consideration by the 5th (Fifth) of
                    every month. The Patron shall ensure that payment towards all undisputed invoices are paid within 15
                    (fifteen) days from the date of the invoice.</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>4.3</strong> In the event that the
                    payment against the Accommodation booking price has been
                    received through the Platform, the Company shall deduct its Consideration and shall remit the
                    remaining to the Patron by the last day of the month.</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>4.4</strong> All payments and
                    considerations payable to the Patron pursuant to this Agreement
                    shall be a subject to the Patron submitting all valid documents in Page4of10 respect of the
                    following to the satisfaction of the Company within 7 (seven)days from the execution of this
                    Agreement:</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>4.4.1</strong> Certificate of
                    incorporation, if company/Partnership Deed, if Partnership firm
                    or LLP,</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>4.4.2</strong> Copy of PAN card;</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>4.4.3</strong> Lease Agreement, if any;
                </p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>4.4.4</strong> Bank details;</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>4.4.5</strong> Copy of registration
                    license;</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>4.4.6</strong> GST certificate.</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>4.5</strong> All payments shall be
                    subject to applicable taxes.</p>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">5. PATRON SERVICES</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>5.1</strong> The Patron shall maintain
                    Inventory as per Clause 2.1 above. The Company may
                    request the Patron to provide additional Accommodations for certain periods as may be required from
                    time to time.</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>5.2</strong> The Patron shall ensure
                    that Rate Parity is maintained in respect of the
                    Inventory being offered pursuant to this Agreement. In the event, the Company becomes aware that the
                    Patron has failed to maintain Rate Parity, the same shall be considered a material breach of this
                    Agreement and the Company shall be entitled to terminate this Agreement in accordance with Clause
                    3.2.2 above.</p>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">6. SERVICE CONDITIONS</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>6.1</strong> The booking or
                    reservations shall be confirmed subject to availability of
                    Accommodation with the Patron. The Company shall notify all confirmations of bookings made on the
                    Platform to the Patron via email and notification on Extranet.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>6.2</strong> The Patron agrees and
                    undertakes that it shall at all times act in good faith
                    and shallnot in any way commitacts prejudicial tothe interest of the Company orthe Users of the
                    Platform including without limitation acts which in Company'ssole discretion may
                    amounttodefraudingtheCompanyoritsUserssuchasmisuseorabuseofanybenefits, accruals or offers made
                    available by the Company.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>6.3</strong>
                    TheHotelPartneragreesthatnothinginthisAgreementshallrestrictCompany’srightto
                    supply the Inventory to any third-party to meet any contractual obligations between the Company and
                    such third-party.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>6.4</strong> The Patron shall at all
                    times honour all bookings and reservations confirmed via
                    the Platform. The Patron shall also ensure that a confirmed booking shall not be cancelled and/or
                    modified, without the express consent of the relevant User.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>6.5</strong> In the event the Patron is
                    unable to honour any confirmed booking or reservation
                    due to any reason whatsoever, the same shall be considered as a material breach. In such event, the
                    Patron shall make available an alternate comparable or better Accommodation, at its own cost and
                    expenses, to honour the confirmed bookings or reservation. The Patron shall be solely responsible
                    for any consumer complaint arising out or in relation to Patron's inability to honour the bookings.
                </p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>6.6</strong>
                    Patron shall provide Listing Information with regards to each Accommodation on the Platform. If the
                    Listing Information is untrue, inaccurate, misleading, not current or incomplete, it shall be a
                    material breach under this Agreement and Patron shall indemnify the Company for any and all claims
                    by Users/third parties arising from the same.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>6.7</strong> By making a booking or
                    reservation through the Platform, a direct contract (and
                    therefore legal relationship) is created solely between the Patron and the User on confirmation of
                    such booking/reservation. To the extent necessary, the Patron hereby empowers and grants the Company
                    explicit authorization to confirm User reservations on its behalf for bookings/reservations made
                    through the Platform.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>6.8</strong> The Patron is bound to
                    accept User as a contractual party, and to handle the
                    confirmed booking or reservation in compliance with the Listing Information at the time the
                    reservation was made, including any supplementary information and/or wishes made known by the User.
                </p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>6.9</strong> Patron and Company may
                    agree to jointly or severally undertake promotional,
                    marketing, and other activities, details of which shall be mutually agreed. Further, the Patron
                    agrees and undertakes that Company shall be at liberty to offer discounts to the Users on behalf of
                    the Patron to the extent as may be intimated by the Company to Patron from time to time.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>6.1</strong> The booking or
                    reservations shall be confirmed subject to availability of
                    Accommodation with the Patron. The Company shall notify all confirmations of bookings made on the
                    Platform to the Patron via email and notification on Extranet.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>6.10</strong> The Company at its sole
                    discretion may charge convenience fees from its Users
                    for confirmed bookings/reservations, as considered appropriate by the Company.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>6.11</strong> The Extranet will provide
                    the Patron with a User ID and password which allows
                    the Patron to access the Extranet. The Patron shall safeguard and keep the User ID and password
                    confidential and safely stored and not disclose it to any Person other than those who need to have
                    access to the Extranet. The Patron shall immediately notify the company of any (suspected) security
                    breach or improper use.</p>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">7. REPRESENTATION AND WARRANTIES</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>7.1</strong> The Patron represents and
                    warrants to the Company that:</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>7.1.1</strong> It has all requisite
                    power and authority to execute, deliver, and perform its
                    obligations under this Agreement and has been fully authorized by all requisite corporate actions to
                    do so. The representation herein is in respect of all the Inventory and also includes representation
                    that the longterm management contracts entered into by the Patron shall not cease, expire, or
                    terminate during the Term;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>7.1.2</strong> The Person executing
                    this Agreement on behalf of the Patron has been fully
                    authorized to do so;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>7.1.3</strong>
                    It has all necessary statutory and regulatory permissions, approvals, and permits for the running
                    and operation of its establishment for the conduct of its business, more particularly for the
                    services herein;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>7.1.4</strong> It has full right,
                    title, and interest in and to all trade names, trademarks,
                    service marks, logos, symbols, proprietary marks, and other intellectual property marks ("IPR")
                    which it provides to the Company, for use related to the services, and that any IPR provided by the
                    Patron will not infringe the marks of any third party;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>7.1.5</strong> It will provide such
                    co-operation as the Company may reasonably request in
                    order to give full effect to the provisions of this Agreement;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>7.1.6</strong> All Listing Information
                    available at the Patron's website or provided by the
                    Patron on the Platform is true, correct, and updated at all times;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>7.1.7</strong> The Patron shall at no
                    time charge any extra charges, taxes, and/or levies,
                    over and above what has been specified at the time of booking. The Patron shall only charge the
                    customer for any additional facility used by the User which was not included while making the
                    booking;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>7.1.8</strong> The Patron represents
                    and warrants that all information provided to the
                    Company which shall be contained on the Patron's website or as shared with Company or any marketing
                    or promotional materials in connection with the services of the Patron is true, accurate and correct
                    as of the date of the agreement.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>7.2</strong> The execution and
                    performance of this Agreement by either Party does not and
                    shall not violate any provision of any existing Agreement, law, rule, regulation, any order, or
                    judicial pronouncement.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>7.3</strong> The Patron covenants not
                    to misuse or copy the IPR of the Company.</p>
                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">8. CANCELLATION REFUNDS AND RETENTION
                    POLICIES</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>8.1</strong> In the event of
                    cancellation of a confirmed booking, the amount refundable to
                    the User shall be as per the cancellation and refund policy as may be mutually agreed between the
                    Patron and the Company.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>8.2</strong> The Patron agrees to be
                    bound by the terms of the agreed cancellation and refund
                    policy and shall process the claim for refund accordingly.</p>
                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">9. INDEMNITY</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>9.1</strong> Patron agrees and
                    undertakes to defend, indemnify and hold harmless the Company
                    and its affiliates, directors, officers, and employees from any and all claims, demands, actions,
                    suits, or proceedings, liabilities, losses, costs, expenses (including legal fees), or damages
                    asserted against the Company arising out or in relation to –</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>9.1.1</strong> any consumer complaints
                    arising out of Patron's services under this Agreement
                    including but not limited to unavailability, deficiency, and/or misbehaviors by employees of the
                    Patron;</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>9.1.2</strong> breach of any applicable
                    laws pertaining to the subject of this Agreement; and
                </p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>9.1.3</strong> breach of any
                    representations, warranties, and obligations under this
                    agreement.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>9.2</strong> Similarly, the Company
                    shall, subject to Clause 12.2 below, defend, indemnify
                    and hold harmless the Patron and its directors, officers, and employees from any and all claims,
                    demands, action, suits or proceedings, liabilities, losses, costs, expenses (including legal fees)
                    or damages asserted against the Patron arising out or in relation to:</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>9.2.1</strong> breach of any applicable
                    laws pertaining to the subject of this Agreement; and
                </p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>9.2.2</strong> breach of any
                    representations, warranties, and obligations under this
                    Agreement.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>9.3</strong> The obligations set out in
                    this Clause 9 shall survive the Term of this
                    agreement.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>9.4</strong> No special, punitive or
                    consequential damages shall be recoverable from the
                    Company. It is further expressly understood and agreed that the Company shall not be liable to any
                    third person for the damages or injuries which the said third person may incur directly or
                    indirectly, as a result of any errors or omissions of the Patron or in connection with any bookings.
                </p>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">10. PROCESS FOR DEALING WITH USER COMPLAINTS
                </h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>10.1</strong> In case the Company
                    receives a complaint from a User against the Patron, the
                    Company shall communicate the same to the Patron, and the Patron shall be obligated to respond to
                    the same within 2 (two) Business Days of intimation by Company.</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>10.2</strong> The Patron shall take all
                    necessary steps to resolve the User complaint within
                    15 (fifteen) Working Days. At the end of such a period, if the complaint remains unresolved, the
                    Company may take any necessary steps to resolve such a complaint, and the Patron shall assist the
                    Company as may be required.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>10.3</strong> If the resolution of the
                    complaint involves a refund, the Patron shall refund
                    such an amount to the User within 48 (forty-eight) hours of receipt of such a complaint. Where the
                    Patron fails to refund the amount, the same shall be refunded by the Company. The Company reserves
                    the right to recover the amount of such refund from the Patron, and such an amount shall be paid by
                    the Patron within 7 (seven) days of the recovery request made by the Company.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>10.4</strong> The Company is not
                    responsible for and disclaims any and all liability in
                    respect of User complaints. The Company may at all times and at its sole discretion (a) offer
                    customer (support) services to the User, (b) provide, at the costs and expenses of the Patron,
                    alternative accommodation of an equal or better standard in the event of an overbooking or other
                    material irregularities or complaints in respect of the Patron, or (c) otherwise assist a User in
                    its communication with or actions against the Patron.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>10.5</strong> In the event of a valid
                    claim of a User related to Rate Parity, the Company
                    shall promptly notify the Patron of such a claim and provide the Patron with the relevant details of
                    the claim. The Patron shall immediately adjust to the extent applicable the rate(s) made available
                    on the Platform such that the revised rate is available for further booking(s). The Patron shall
                    immediately adjust the rate in the reservation made by the relevant User. Upon checkout of the User,
                    the Patron shall settle the difference between the booked rate and the revised rate either (i) by
                    charging the Guest at the revised rate or (ii) refund the difference between the two rates.</p>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">11. OVER BOOKING AND CANCELLATION</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>11.1</strong> In the event of
                    cancellation of bookings due to overbooking or any other
                    reason, the Patron shall promptly inform the Company via [Insert email id] of the reason for the
                    failure to provide Accommodation. The subject line of such email shall state 'Non-availability of
                    Rooms'.</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>11.2</strong>
                    In the event of non-availability of Accommodation, subject to Clause 6.4 above, the Patron shall
                    make arrangements for alternate Accommodations, and shall:</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>11.3</strong> In the event of
                    modification of Accommodation or Services selected by the
                    Users, the Patron shall take necessary steps to resolve any complaints that the User might make as
                    per Clause 10 above. The Patron shall pay any compensation and make good any loss suffered by the
                    Company due to such modification. Such amount shall be reimbursed by the Patron no later than 14
                    (fourteen) days after receipt of the invoice towards such compensation and loss.</p>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">12. LIMITATION OF LIABILITY</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>12.1</strong> Neither Party shall be
                    liable under this Agreement for any indirect,
                    incidental, special, punitive, or consequential loss or damage, any loss of profits, loss of
                    business, loss of revenue, and/or loss of goodwill, except in case of any infringement of
                    intellectual property rights or any violation of the law.</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>12.2</strong>
                    Further, notwithstanding anything in the Agreement to the contrary, the maximum aggregate liability
                    of the Company under this Agreement shall be limited to the amount received by the Company as
                    commission in the month immediately preceding the month in which the cause of action arose. The
                    obligations set out in this clause shall survive the Term of this Agreement.</p>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">13. FORCEMAJEURE</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>13.1</strong> If either Party is
                    prevented from performing its obligations due to any event
                    which is unforeseen and beyond the reasonable control of either Party, including but not limited to
                    war, riots, civil commotion, acts of God, fires, storm, earthquakes, epidemic, pandemics, restraints
                    imposed by the government, acts of the legislature (“Force Majeure Event”), then such Party shall be
                    excused of the performance of its obligations during the period of such Force Majeure Event. The
                    Party that is unable to fulfill its obligations due to any Force Majeure Event shall:</p>

                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>13.1.1</strong>
                    Promptly after the occurrence thereof give notice to the other Party with details of such Force
                    Majeure Event; and</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>13.1.2</strong>
                    Work diligently and use its commercially reasonable efforts to resolve and minimize any delay or
                    remedy.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>13.2</strong>
                    If the Force Majeure Event continues for 30 (Thirty) days consecutively after reporting, then,
                    notwithstanding anything contained in this Agreement, the affected Party shall have the right to
                    terminate the Agreement by giving 7 (Seven) days written notice to the other Party.</p>
                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">14. AMENDMENT</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;">No modification, amendment, waiver, discharge,
                    or termination of any of the provisions of this
                    Agreement shall be effective unless made in writing specifically referring to this Agreement and
                    duly signed by each of the Parties.</p>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">15. CONFIDENTIALITY</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>15.1</strong> Each Party ("Disclosing
                    Party") acknowledges and agrees that in connection with
                    this Agreement, the other Party ("Receiving Party") will have access to sensitive information
                    relating to the Disclosing Party including but not limited to business affairs, operations,
                    products, processes, methodologies, plans, projections, know-how, market opportunities, suppliers,
                    Users, marketing activities, sales and/or software ("Confidential Information"). The Receiving Party
                    hereby agrees not to disclose any Confidential Information to any third party and not to use any
                    such Confidential Information for any purpose other than as strictly required for the performance of
                    this Agreement. All such Confidential Information is and shall remain the exclusive property of the
                    Disclosing Party.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>15.2</strong> The Receiving Party
                    undertakes to use all precautions required to enable it to
                    comply with all the terms of this Agreement and to ensure similar compliance of the same by its
                    employees/personnel.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>15.3</strong> Notwithstanding the
                    foregoing, the obligation of confidentiality shall not
                    apply to any disclosure of information: (i) that is in or enters the public domain other than by
                    reason of a breach by Receiving Party; (ii) that was in possession of Receiving Party prior to
                    disclosure; (iii) required by law, legal process, or order of any court or governmental body having
                    jurisdiction.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>15.4</strong> Any breach of the
                    aforementioned confidentiality obligations by either Party is
                    considered a material breach of this Agreement, and the non-defaulting Party shall be entitled to
                    terminate this Agreement in accordance with Clause 3.2 of this Agreement.</p>
                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">16. MISCELLANEOUS</h4>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>16.1 Arbitration and
                        jurisdiction</strong> <br> All claims arising under this Agreement shall
                    be resolved amicably by the Parties. If such dispute is not resolved amicably between the Parties
                    within 30 (Thirty) days, then the same shall be referred to arbitration. The arbitration proceedings
                    shall be carried out by a sole arbitrator appointed mutually by the Parties in accordance with the
                    rules and regulations under the Arbitration and Conciliation Act, 1996. The arbitration shall be
                    conducted in New Delhi in the English language. Subject to the above, the Parties agree to submit to
                    the exclusive jurisdiction of courts of New Delhi in respect of any dispute under this Agreement.
                    However, the Parties shall have the right to approach the courts of New Delhi at any time for
                    injunctive relief.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>16.2 NOTICE</strong><br> All
                    correspondence and notices under this Agreement shall be given
                    in writing at the address as set out in this Clause. In case of a change in address, each Party
                    shall notify the other Party, in writing, about such change.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>16.3 Severability</strong><br> If any
                    provision of this Agreement shall contravene or be
                    illegal, invalid, or unenforceable under any applicable laws, then such contravention, illegality,
                    invalidity, or unenforceability shall not invalidate the entire Agreement, and the Agreement shall
                    be modified to the extent necessary to make it enforceable. If the provision invalidated is of such
                    a nature that it cannot be so adjusted, the provision shall be deemed deleted from this Agreement as
                    though the provision had never been included. In either case, the remaining provisions of this
                    Agreement shall remain in effect unless the modification or deletion renders the remaining Agreement
                    in violation of the original intent of the Parties.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>16.4 Independent Parties</strong><br>
                    Parties acknowledge and agree that the relationship
                    between them is solely that of independent contractors and nothing in this Agreement is to be
                    construed as employer/employee, franchise/franchisee, agent/principal, partners, joint ventures,
                    co-owners, or otherwise participants in a joint or common undertaking, and the relationship is
                    purely on a principle-to-principle basis.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>16.5 Modifications</strong><br> This
                    Agreement is subject to changes by the company and its
                    management from time to time. The changes will be communicated to the Patron. In case of any damages
                    to the Patron due to changes made by the company but after these changes being communicated to the
                    Patron, the company is not liable for any claims arising in this course.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>16.6 Survival</strong><br> The clauses
                    of this Agreement that are by their nature intended to
                    survive shall so survive the Term of this Agreement.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>16.7 Assignment</strong><br> Each of
                    the Parties understands and acknowledges that each Party
                    shall not assign or otherwise transfer its rights or obligations under the Agreement, in whole or in
                    part, without the prior written consent of the other Party. However, the Company may at any time
                    assign or transfer all or any part of its rights or obligations arising under or in connection with
                    this Agreement to any of its affiliate entities without requiring the prior written consent of the
                    Patron.</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333;"><strong>16.8 Entire Agreement</strong><br> This
                    Agreement contains the entire Agreement of the
                    Parties with respect to the subject matter of this Agreement and supersedes all previous
                    communications, representations, understandings, and Agreements, either oral or written, between the
                    Parties with respect to the said subject matter.</p>

                <h4 style="font-size: 18px; margin-top: 15px; color: #000;">BY REGISTERING AND SIGNING UP TO THE
                    COMPANY’S PARTNER PROGRAM AS A PATRON, THE PATRON HEREBY HAS
                    REVIEWED AND UNDERSTANDS, ACKNOWLEDGES, AND ACCEPTS THE TERMS AND CONDITIONS OF THIS ONLINE PATRON
                    AGREEMENT.</h4>
            </td>
        </tr>
        <tr>
            <td style="text-align: center;background-color: #f4f4f4; padding: 20px;">
                <p style="font-size: 16px;line-height: 1.6;color: #333; margin: 5px 0;">We’re thrilled to have you
                    onboard and look forward to a successful partnership!</p>
                <p style="font-size: 16px;line-height: 1.6;color: #333; margin: 5px 0;"><strong>Best regards,</strong>
                </p>
                <p style="font-size: 16px;line-height: 1.6;color: #333; margin: 5px 0;"><strong>RRooms Hospitality India
                        Pvt. Ltd.</strong></p>
                <p style="font-size: 16px;line-height: 1.6;color: #333; margin: 5px 0;"><a
                        href="mailto:info@rrooms.in">info@rrooms.in</a></p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};