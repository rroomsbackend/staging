SELECT 
    pm.id AS property_id,
    pm.name AS property_name,
    COUNT(rd.id) AS valid_room_count,

    -- Total active properties
    (
        SELECT COUNT(*) 
        FROM propertymasters 
        WHERE status = 1 AND deletedAt IS NULL
    ) AS total_active_properties,

    -- Total valid rooms
    (
        SELECT COUNT(*) 
        FROM propertymasters pm2
        JOIN rooms r2 ON r2.propertyId = pm2.id AND r2.deletedAt IS NULL
        JOIN roomdetails rd2 
            ON rd2.roomId = r2.id 
            AND rd2.categoryId IN (1, 2, 3, 5, 6, 7)
            AND rd2.status IN (0, 1, 2, 3)
            AND rd2.deletedAt IS NULL
        WHERE pm2.status = 1 AND pm2.deletedAt IS NULL
    ) AS total_valid_rooms,

    -- Total available rooms
    (
        SELECT COUNT(*) 
        FROM propertymasters pm3
        JOIN rooms r3 ON r3.propertyId = pm3.id AND r3.deletedAt IS NULL
        JOIN roomdetails rd3 
            ON rd3.roomId = r3.id 
            AND rd3.status IN (0, 2)
            AND rd3.deletedAt IS NULL
        WHERE pm3.status = 1 AND pm3.deletedAt IS NULL
    ) AS total_available_rooms,

    -- Total bookings from RRooms with fromDate = today
    (
        SELECT COUNT(*) 
        FROM bookinghotels bh
        JOIN propertymasters pmb ON pmb.id = bh.propertyId
        WHERE DATE(bh.fromDate) = CURRENT_DATE
          AND bh.source = 'RRooms'
          AND bh.bookingStatus != 0
          AND bh.deletedAt IS NULL
          -- AND pmb.status = 1 
          AND pmb.deletedAt IS NULL
    ) AS today_booking_count,

    -- ✅ Checked-in bookings today (status = 2)
    (
        SELECT COUNT(*) 
        FROM bookinghotels bh2
        JOIN propertymasters pmb2 ON pmb2.id = bh2.propertyId
        WHERE DATE(bh2.fromDate) = CURRENT_DATE
          AND bh2.source = 'RRooms'
          AND bh2.bookingStatus = 2
          AND bh2.deletedAt IS NULL
          -- AND pmb2.status = 1
          -- AND pmb2.deletedAt IS NULL
    ) AS today_checkedin_count,

    -- ✅ Checked-out bookings today (status = 3)
    (
        SELECT COUNT(*) 
        FROM bookinghotels bh3
        JOIN propertymasters pmb3 ON pmb3.id = bh3.propertyId
        WHERE DATE(bh3.fromDate) = CURRENT_DATE
          AND bh3.source = 'RRooms'
          AND bh3.bookingStatus = 3
          AND bh3.deletedAt IS NULL
          AND pmb3.status = 1
          AND pmb3.deletedAt IS NULL
    ) AS today_checkedout_count,
    
    -- ✅ Cancelled bookings today (status = 3)
    (
        SELECT COUNT(*) 
        FROM bookinghotels bh3
        JOIN propertymasters pmb3 ON pmb3.id = bh3.propertyId
        WHERE DATE(bh3.fromDate) = CURRENT_DATE
          AND bh3.source = 'RRooms'
          AND bh3.bookingStatus = 4
          AND bh3.deletedAt IS NULL
          AND pmb3.status = 1
          AND pmb3.deletedAt IS NULL
    ) AS today_cancel_count

FROM propertymasters pm
JOIN rooms r ON r.propertyId = pm.id AND r.deletedAt IS NULL
JOIN roomdetails rd 
    ON rd.roomId = r.id 
    AND rd.categoryId IN (1, 2, 3, 5, 6, 7)
    AND rd.status IN (0, 1, 2, 3)
    AND rd.deletedAt IS NULL
WHERE pm.status = 1 AND pm.deletedAt IS NULL
GROUP BY pm.id, pm.name;