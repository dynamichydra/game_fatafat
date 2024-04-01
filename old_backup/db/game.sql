-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 08, 2023 at 03:22 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `game`
--

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `id` int(10) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `subdomain` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`id`, `name`, `path`, `subdomain`) VALUES
(1, '1', '1.png', 'game'),
(2, '2', '2.png', 'game'),
(3, '3', '3.png', 'game'),
(4, '4', '4.jpeg', 'game');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(10) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `small_icon` text DEFAULT NULL,
  `subdomain` varchar(30) DEFAULT NULL,
  `show_count` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `icon`, `small_icon`, `subdomain`, `show_count`) VALUES
(1, 'Lottery', 'cat-01.png', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAYhSURBVHgB7VlLUhtJEK1qHAH2xvgEI05gOIGbEwxzAmBjC2+AEyBOMLAxcniBOAH4BLRPgHwC99wAb2wRYXXNe1lVrZJQ9Uc4YmahjJAtdWd3vfy9zCqUWspSlrKU/1K0+k1iut1OURQ7Kkle46WpMmZdab2OW3nS72+IzsHB3/jvi1pdzfTZ2b36DfJMPVEAfM8otYtPqpNkckNb3+D6ValnzBG+HqnRSI273QG0r3S/n6knyMIRAKAU4C7xtVOhVnq/6Ha/RXQzgNiHIblaQJKW+socHa0zFQD+VtWAB7BteabbPanQpSO+OZ3W0toAhH+9MOZVlQoADfTa2ha9SmD43VM1Qh1E6ZYOUi2kVQrB8zv64uJGvrui1Vq/YbECQK6K4mvy4sWABSpAHh5OXN63kQxpt91UubEBkjYAQ+9WFR+BFz9+7KGgD1V1is2VAvXwrN8fNNVvZEAkDXJ4fgijvvJHovVLfN9U/Fj6XEQmlPv+/aH+8OG87oFaA5gqLDLVVqxxw2ChTp1xjO5Kv7//C6maGHNNEqij2SZ9oDk7GHNvtD5P1tbOYo1K6NeYQxiy8+im1hJNbUwqupamN6qWrIyA4/pb1QS7UgTe88BdEfuOfI9PjpQoI0JCgCHszJ0AjHicbKTYzVV9TdRFYFc1kHARZ/SJGY3SUsEY+QAYewP1rshm0B0iYteSWhFJLIZBxf35Ig1LqT1VIwBwTPDCPu/eXbuIpRF11lOPOijSTfYJvbpKysx5c+yigfv/BM+krEPV1oAxw18HnkV3cXEmxj483E7lNesBaYXPqZuH8ilDiuKO0WLK6fH4L15EdGwkimIYrlPMqxcn0RTyhVQhOaw/lW9oWEEa5DLbfPyYhcrCZjPpwt+4zo49xHB3jjXf8Dqbofn586RkLGNex0BEI5AkycBPkvPEcAizo0In7La+ECUqnEBRrHKd6WLM8fRLzHrhWI7rAfCmjwrZLHhnGsUZu0HGACfvYVRgePM5D3rjTgKjBn6qhAcvSYMw7voXDHFGZI/WQZ3RWMdQmfEGgYrLdSt6R7wGut1Lepds4abKfGphBwYAdwIDvkwUJnnrc5uFO3et0WjHPc8+kI4PDo6kNvy6pOK2BohntL5DCuxK+PkyFKZFajussEPgnbIILZhTp59hEVvoxlxG1vLFm8tv9IeSpTDVkgxiOON9wC5OKh3AiO+MBDxzypdLY5oP5BBG3TA6SL+eejw/bbkd3Oz+4CX/QR2QuezyYCmsd4xIMJWiE218PxCAlFyGB0mZ+JmpiimTHF8cHFz7dGGUxm/fHrE45bXoGWSpmce+8x+M51OpQmf5VFZtDZjKZ7LFaCRegGc++7SRgvVpFQg2PJ9ZlDIuYBDEaC07uMCIjMNesJb9niSd2XdJKiMFVVsDZpsJ2OjQrpHc0CAPBheymSdzP1YUQYHL75AOA8NXbFSVbI7mQVHqRrU1QICGYkF3vNc9GIT5fEavBIY9QvgONr6BqNiUkOc99cq1yEzkDWxlgOPzbOZyx97U94yI8DfTwZgJUNuMRM9R8AZGha1yj0w2Ykd2xpbdPD62Z1UnFpWbel3RiYWb2e6p9/w5izIvb9kRoSP3SIWfPlnaZU2MRnfe06iN/bKbRwbHogqDarAjC89z4MVXbDC4ZsoXaL0HT185EOT5NHicnTV/tBuD59nhy5GDRs1ntnKLGZPaY5WA8nKZUWa6KZrTwDc7niaI/oRhUm09mwp4O6GeImIbJXhOsRFaLibpVYWvXsDFZ6Q6sgs5nbQ450U9gCoXdF16sxwDxuOhTyV3v/Jkj90XzTDawIJ160WK1W0VK44IKTm9tlJReH7HpiomTL5Hir7BAXCrgy0Zsuw+tomwWd0bR6uaKVQUqT+x5jxlyGZ0hk2vcD+x3fSstNXpdLK6OkDB/amqvecl5T649FBRVJ5YBL0ha3PQ2yoCXlATPd3iuOXRiUVYH5y5yEoLHrMvZIAH0eCEevbEQv6WoKYjmLvj9UwtIAsb4CUCyt7DiYVs+iM9gk2qzTnoPHmyAV58DheW+//g7oo0GGzmubfI5AQbc9aif9BYylKWspT/l/wLmHCM+cjwSpcAAAAASUVORK5CYII=', 'game', 12),
(2, 'Fishing', 'cat-02.png', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALVSURBVHgB7Zi9ThtBEMf/s7gwVEg8QJwnwJRUmJoiuKAONMjQxHmC2BItwqk4yYVJjxSnoMapKLGfgHsBFFdgCt9m9u5I7s57vjv7sCyxPwlxX+Od/+7M7AdgMBgMBoPB8H6hLB/LWq3C/3YkURlSlvm65L2QQxD1peP8EkJ0ybJsZEDW6+uuM63WcErbJSnlvRSiuXJ52UIWAcpxCXzjy0qq74ErATTTCnFqtQffmV2dDbd/yM5fcCcpobawrI9II0D1jHx+7rDhPmaAf7zBDjUT2xiN/vi3tsPCV4CeEhLXcSyAAm1M+eGXl1s/VOahR8ViNS483NAAHpCBoAAR+9VodJGD84oK9/C9chT5YAdvtALcmAMOkR8lTvyfr8kaxI15VQTSMwje6AV4cRduaHsbdH4OOjsD+DozPJockh3tK6IfSAnnSDd4PyHAL5WlCcu9PWBtDdjYAB0cYCak3B+fnNSjj9mJVtpRUAkesQ3DCvUVZ3X1//XTE2aFuBzK09NQbqkwIqItROI7iirP0TI7IYDTe1NrfH0NPD66zsubG8wD1/RONB9cEVxCp5jZQvO+oPmwBB13d5D8lwtePtxyuFYjPfohzoTG4yq12/bE8+gDnhUlFglRl0dkwI7sQDfTc244RF8LlnWlMy/oDPwpezFwYlNc3hENued3C+12P848JMCv/4tzPgkpf9MU5xWhJGbnP2OJIFVeE4hWoQqWBL9k9pK+CwvINqW/JdqSqSMcQkTfsQS4JTPlXiIkYMWyGjx0qdcluaNKJnCUlLhBtPuBca3WIM2C7o2x/ckqtfMK7WpUjQQLOELC2iQ3pOzypmcrq/OKxD3x+Pi4TkJ8QdwSYz565O2de5iR1KcS/sb6E1SpnWem9k8w5nX8lUzHKv984D2D4zhlCLFJ3siU2LH1kDDPUVWWbalC0XEGfOTSR7HYn3Z8YjAYDAaDwWBIz1/VmDIFE5EbzgAAAABJRU5ErkJggg==', 'game', 4),
(3, 'Slots', 'cat-03.png', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASISURBVHgB7VdNctNIFO5uqQqziucE0ZwA3wBzgsQniLMAbDYxJwg5Ac7KARY4J8A5wSgnGM8JRkcwCwpDlbr5XqslteRuWSYLstBXlYqkfn/9/s1Yhw4dOnTo0OHPgbNHDjWdvldSjhnnG875W75YrOzzR30BNZmMFWOf7W+81/uLz+eb/F2wRwzJ2LD+Ld1uT+33R30BGBc7vl2q2ayfv4dNAjThdtv3EvR6WSibaJpA/M28MVLoFnn+HM+R+RbJ7XaG/+/oxVkD6vXrC0UEnDcaBuYXoPuH/T4SY+BlKzqlLrRNVNBPnvxNtSCcxnM+32c8BC7x74w9DFEmTG320aEDkV3Xhr4vf/wY02PlAqj6CEQz1gJgvFVKnbIHgtIDOm/3EsJoTcuYvgSicWLsKIGqH7My11poR5Qy78WFHkQG3hpReuHv3CiMa16m97yfD2HEmrXDUHCeyxpSjRZFbPK+bUrEUsoBF1CNP+TjSBdjmvbFp09eY/LuQblLz+r792Ge0zCqlWJF9SJEAvoB+/kz0kWM1LlUpqpb4g70CZgvtEHk7ZubmB2IdDJZgvcMkT8XtYHVBlzKkdB5f5jx5IU10uS4+NDrtU2BqgGcH+n/Wdom7ECkQugUGlaEMnYFj1BxLCklWBhGksIl5QahG5DHTMjzLhXboz199WomgiCp7yx2+uh3clzZBIo0Mvr70D936I/yqOcIHXkfB9V0IO+ujFLaTc6geJMPEGV5zuT1paI2N5kkMGqN5/9wdMy+fbvm1fqwe/9RUeRSroOPH1dO/W/eDLDYFRdABBEBuh3n+ZcNPBerly8HLAhOcOM7ujnyOzE8zy3BkWYh/lwgFed0uoTRM32uFHmsjwVsZEfJpO2Y2cgLOQwTOsc7Da1b7XlMbM1vGZ8JUs/CysCC5zQzlOq6SNMZCuWFV2mmeIBi/IyQ3+P5mTE+l7cSHz6M2C52Ji/4vtprgVmhZ1Tg4Xy+NPqHdb6dXQhE/5e2oZ+XYfeOeyge68tVW2HCnz4935Hvc0Rp+L9GOcOAexsuFkvzfkERrdN7t1E9kEwt7FPqgm6tVtoUcjl/304AXwWLxbzg80x97wVwcJU/p0gTdgBw2SurbsrvlJ4eQ/KWWrwrdV3woXiZZ0OgCySO74ltQFC2TFujdwET2aLnQuTjYTUdlcEopW+x/Ept9J47BJtizoUfFZ2KZe2rYYO8c3k/s8OsHw5DmvQjA/rCsWoIKeOQvOWYBZFdzLbxmXTl3V8ULVs+YHJ6TsgZUUWOpV+496SEY14IE6qYHYZjanuuAyg7eK3Qw9CVpg2QpkZ1PGntpapvy6xTDhOTHQjh2XcCiuaeH1A2dHu9uVkaW0rI6fQLa/MjBQr1BqnUF8fZyqwPu0eYnDg/3WXhI+WS5ZJR23zDmoJrhHP/BWjXSdMES5vr7JT7ZHDuol+juCNPcdcR19f2ChcdKqv/NyEIAjIyZg8E0uEexp/sJ9QL5M5k37k2NtF3piYac1z/yJbyjj0Micg2zeE+OtrJfO25Q4cOHTp06PCn8AvWvyvb0wFXggAAAABJRU5ErkJggg==', 'game', 4),
(4, 'Sport', 'cat-04.png', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAU3SURBVHgB7VlNdho5EC6psQNk03OCaZ9g8AmCTxDmBMaLGFhBTmB8AvAmD8jC5ARmTmB8ApgTpOcE6U0AQ1qaKiEcwK1uNZCXDd97vO7Xkkr1XyUBcMQRRxzxO8HgQJDVqieEKAHnf4GURfy5wJi7HJQBY8zHN19K+cQ5H7BOx4cDgMOe+FGrldQTwEOG68hsGZbv7sskfJcABfyV8L2Fc2mOEhr2xM4WwM2LQsp7IGYB+pyxW/oeAjSZlJeGZb5g7Oqk0xnKSqWO65soUCBxbabT6cMOSC2AbDRcmE5vBEADDMzNa7WGI0RrfRDn32VyuSbMZi660T1ao7g+zqVsQz5/y9rtAFIglQBkctz8gdzBNAcZabJe71bFhJSPinktGLkbC8P7DffahI+WvEgTH9YCrDHkWUxXjKC2A3A1r9FWM661FcI6iBVByix2IGFHi3zeI5cR0+nIknm1FlLASgB5fX2jfJ/zO7CHy4UoaIY861WM9UlZsla7tJqeNOFHtVrGrHKPfnyRmc3G4s2bb2AJzC5XDgW3jgUb0D6S88AJwxG9U+zEzU+0ADJ/Q08Hn6zfp4I0BEtgJgoWyAzYwyeGkfm6Ym6ZpmMRKwBpH7T5Ke2RG6EvfwELhFJ+xGw0OP30aUyWoGqcuEjKFe2ifnqaByN4wuCGH4rJpOHMZoMEZvxQiPPTXq+NxaqF8dNystkBtg/nNAZx+3HeX1ea+mYuiiseo6FzfnHjI7YK5Eb4jLQCuRelwBPHCUSl8kiZB/24QVlIbfb8fC5NawGGFLzbSlOWj2k5jAKEW5VySU0qwVDD/e1YoErLO52LRRi6FLRblVbVkDCXK2LLUBa67YA1wUP8Jstl95XSiDY1iWkFQGbfr70HtCnP589ISydv3/rELGr7jDRKPn7S7Taov3E4J217ERQ9JsQDpWQM1Ca5GdK8o0xDtDLZ7Jisu6K5ySV2uAYY02hYqYxQMwEFLTVaKoAnkzJ+u9StBDVwX5hOc+TvtsUKNx2wXO6K+h7dFL5XXexaY6cs/bMx9J1u98xAKxrzDx8Kp58/j1UBm0zqirnoHuYOiTfC6+tvMT3OK/Bc7o9wNiuxiFSJ38aM84+kHB2LLd7t/h1Jx7QBBqIbklYnk69o5mYMc8rVsPj8A5ZQAYva3w7YFdAKBRUzlYoSzsR8rAC6ejYstOrpLDEESyCDT+oZEbBbKCMfXzGjPZgmxAWxdQWlLKHqg+18FJZ833a+jMqIGmYBMKDAdgPGiqo+JBQqjYDaBdRsCSyBMeGbxngMU09guwHAO/2aGAeozRXdd2AJjMH/TGNGATBnj8Ee7oLSIWPJboRzdMwUwBJogaFpLGMaoKsPNHMLLEG9P5/P+yKbvY2bh+31EItYAesJWNNGXkxjsVREtfpokSkUVO+PTRudwGInZrPB4vt3T1fsRFBN4L3euWk8thu1bZ3RUstrETr3UtqL+cnp9IEKZIiFyop2wikw0Y5htZp4qHA6nSt1zwPQBgusbi4wbpqowT9N81D7blwRU3PgANDXiqNUrYTjnDM87MCesBJgUam0UVP1qLFdzr0EdcaGl4r/ehx7LOpwk+hY3Upknp+bKOne2koB34Z5gpUA+jBPvujDr8fyUswSqS62NGEffhHIymmvFlNdrysh8FxL/gkHBtHEQ85F2v8NMpASumlr4O3BeHVntCdebrVhB+ydRunEtpjPPbpJS7UOmd71P4F1HPQvJrrJ4MvLADoGeut/Man2nG4yhPj3kH8xHXHEEUf8XvwPlg/WO6IGfVcAAAAASUVORK5CYII=', 'game', 6),
(5, 'Casino', 'cat-05.png', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANrSURBVHgB7VlNVuJAEK7u+HzoijnBtDeAE4zeAE8gLHyiG5kTqCeA2Uh0I55gmBOAJ4AbmBsMO+MiXVPVBCb8hCSmwyrfe3lp0n/11/XTAJQoUaJEiRwQkBN4fd1ArV9Qygen3++lmaPb7XezeaVSF73eDHJAQk7oIFAgRJUkcYedTjVpPLbbTXqp8MmN3AzI4+MBIM7oqWrf7ySNR2I0fA/ySt/sDznBRKAQv0xbiNtdWohInzd+AAvIzYBZpFLppdHCivRd1wMLsMJAGi0UIX2zX5bBRISK7QyCKnmikTnQiD0IGVrOBRgBMyDEkPp/wi6iMmgnkQG8vKyh43TJPGpMHOwJbGasqSRmdjJAPv6CfHxvn4Svg0yyKfr919j+uA42F5LC++pHNLYug2AIjpPbBa5Baa1rQspbiMYIIWZkcvU4TRzsWPBu5RfiUBwdtWTEd5vD6vtV+GpQknIGh4deGA88esYkuCEidonwRrhvVQOwZ9vq3WI1oK+u/kZMx5Oue7IkfK6dF2qeggWs2zsLBj8/R+bcGSrFTPb737bNjXejEbsnLlvLzfhQI05sER+u3yTTnODNjSGYNbLiqUgLcXOT4wDboOuOzTosecf5XcihJiJJMKNFDDF7cnBMQDIDWnuRX3wuFBSF9UhOwkuakkoDy/WFqEHBIHO6yDI+WyqhtUoxyiMiTujQC3qfwdy7FIZsDKSwffLj5wtvwnbM3os0xwfSgwJgJZmLQjw+Tte/caXG2iB3+QqWYZ2BOLBWHNdtUnMMFrE3BhYgLbyBReydAdrwO1jEXhmg7LZLGmiCRVhnYFvRQ99O+SqFIm1i0Z8VB2AZ5DK79Do37Xm2al3qUWRlwIOkVAKxYS6uKILjx4cquhiyz8AcihjhwAdfgJdlcJozoBYNKi//QMHQGYNdKgYWKa7z/Mz18RSKg3fgugNuhHuqpAmpvFA0xaVCgw+oB7ZBggmTvzl8v5FqWlxHeIOswsU3Cmu+qMJ56qsgHzw2TaPd/2ur5T2S+YBT+fRUhywMBO32vVgt7DlNbi2qs6LAMSOst9XyG9XLlEfdbxsff63ChbXvT2BTwmPOZ6RlM6LDq4iYH7BZa7PgzuKuVXZfbK2rcv/YSTwjlaO2aO/pQDZPaccb//dg4z+EEiVKlCgO/wAaYnuDQh9rKgAAAABJRU5ErkJggg==', 'game', 4),
(6, 'Chess', 'cat-06.png', 'data:image/png;base64,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', 'game', 6),
(7, 'Popular', 'cat-07.png', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAL6SURBVHgB7ZnNcdpAFMffCs+Yo0tQB3YqCK7A7sDkhPDFdBBSgfFNMz7YHcSpwLiCQAdKBfENHcJu/k9gD2DQPi164AO/GRh9LNL+d9/XLkQHDnxeXLd7RcpEpIRLktg51ydl1ASA72TMCSmjNwPOXeLrxPV6qiJUBMB8Wu+jn+dnpIjWDMRvB5bokhRREWAXBBhjrjTNSNOJZ8APbJ73SAkVAXhotniOWbjhsEoKqAiYGvO6dIGjkTE/NUxJRUDDudGHi86dwZRuqWYMKWE7nb/rEpkjemyk6TeqCT0nNma09jJRe5okD1QTepmYaLzpXp0iggQgong7AKcdlt1nEa7T2donKgngKGKT5Bmj+4DPS1nbxvHxkHzPM6Y37Xa3yhFiAdx5l+e/cdji80az+VTW3gwGr5v8YKmdc7fu+jq4XpLPwCwExvOzrOigB1SkLyTAWRtsSiIBbPMwmTZVBA/3zsCc1j+8gwKQCUApsHIplmRVFHVi04h4ARSAV0Bhn8iiH25MJqUvZIGINBckJy7WERXxCrDWrq3nOYLghWtFFLOz7DMiQtYOR74GGMWvm+7BL/p25h9DKB1HUcSR59RNJu2Q9TDedbr0fAyQSdMfZb/xCiD/KMaclCiKWBCHHi4jKJD47QBJ7oZnGYfqAmqHfQHDMCgGw4P+iqwibDbo9rO0/WcTELNfvZ+tLozWIBGQ0b6wNvM18QsQjIIaxvzxNfEnMufGtCeQF558bSJBgyHtiYbg3X4T4rLZud2bETYGkMQyXzOvAC6bkVB+0Y6xxtxJ2onCaLQY2nZDdpSmj5KGIgE8lYjPohGpA+spHxYRJ7Ko2ezTbnLCUDr6jFgA+wJKtHNlh87wjkqbXpVKCTYlY62WCO78uSTyLFK5FjL39yPsNn+hOs0JuxchnS9+SoHwdjmcrY8HhP+ViplEiL7DXmmfAtl6czdIyLzjCAwDyfZMGbXtTs//wGihdrrA6ixe2QjIuCjkfaKI65tmc7Rtxw8cqIn/o64d00VhE7cAAAAASUVORK5CYII=', 'game', 4);

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE `game` (
  `id` int(10) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `rule` text DEFAULT NULL,
  `category` int(10) NOT NULL DEFAULT 0,
  `subdomain` varchar(30) DEFAULT NULL,
  `bg_type` enum('img','css') NOT NULL DEFAULT 'img',
  `bg` varchar(100) DEFAULT NULL,
  `sort_text` varchar(100) DEFAULT NULL,
  `code` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game`
--

INSERT INTO `game` (`id`, `name`, `rule`, `category`, `subdomain`, `bg_type`, `bg`, `sort_text`, `code`) VALUES
(1, 'Win Go', 'Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, ', 1, 'game', 'css', 'win-go-wrapper', 'Guess number/Green/Purple/Red to win', 'motka'),
(2, 'LuckyFishing', NULL, 2, 'game', 'img', 'game-01.png', NULL, 'LuckyFishing'),
(3, 'Fire777', NULL, 3, 'game', 'img', 'game-02.png', NULL, 'Fire777'),
(4, 'DG', NULL, 4, 'game', 'img', 'game-03.png', NULL, 'DG'),
(5, 'Mimbai Rocket', 'Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, Test rule, ', 1, 'game', 'css', 'win-go-wrapper', 'Guess number/Green/Purple/Red to win', 'mumbaiRocket');

-- --------------------------------------------------------

--
-- Table structure for table `game_inplay`
--

CREATE TABLE `game_inplay` (
  `id` int(10) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `game_code` varchar(30) DEFAULT NULL,
  `start` timestamp NOT NULL DEFAULT current_timestamp(),
  `end` timestamp NULL DEFAULT NULL,
  `duration` int(3) NOT NULL DEFAULT 0,
  `subdomain` varchar(30) DEFAULT NULL,
  `result_type` enum('1','0') NOT NULL DEFAULT '0' COMMENT '1= manual, 0 = automatic',
  `status` enum('0','1','2','3') NOT NULL DEFAULT '0' COMMENT '0=pause, 1=running, 2=complete, 3= cancel'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game_inplay`
--

INSERT INTO `game_inplay` (`id`, `name`, `game_code`, `start`, `end`, `duration`, `subdomain`, `result_type`, `status`) VALUES
(1, 'MR1', 'mumbaiRocket', '2023-10-05 03:30:00', '2023-10-05 04:30:00', 60, NULL, '1', '0'),
(2, 'MR2', 'mumbaiRocket', '2023-10-05 04:30:00', '2023-10-05 05:30:00', 60, NULL, '1', '0'),
(3, 'MR3', 'mumbaiRocket', '2023-10-05 05:30:00', '2023-10-05 06:30:00', 60, NULL, '1', '0'),
(4, 'MR4', 'mumbaiRocket', '2023-10-05 06:30:00', '2023-10-05 07:30:00', 60, NULL, '1', '0'),
(5, 'MR5', 'mumbaiRocket', '2023-10-05 07:30:00', '2023-10-05 08:30:00', 60, NULL, '1', '0'),
(6, 'MR6', 'mumbaiRocket', '2023-10-05 08:30:00', '2023-10-05 09:30:00', 60, NULL, '1', '0'),
(7, 'MR7', 'mumbaiRocket', '2023-10-05 09:30:00', '2023-10-05 10:30:00', 60, NULL, '1', '0'),
(8, 'MR8', 'mumbaiRocket', '2023-10-05 10:30:00', '2023-10-05 11:30:00', 60, NULL, '1', '0'),
(9, 'MR9', 'mumbaiRocket', '2023-10-05 11:30:00', '2023-10-05 12:30:00', 60, NULL, '1', '0'),
(10, 'MR10', 'mumbaiRocket', '2023-10-05 12:30:00', '2023-10-05 13:30:00', 60, NULL, '1', '0'),
(11, 'MR11', 'mumbaiRocket', '2023-10-05 13:30:00', '2023-10-05 14:30:00', 60, NULL, '1', '0'),
(12, 'MR12', 'motka', '2023-10-05 14:30:00', '2023-10-05 15:30:00', 999, NULL, '0', '1');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(10) NOT NULL,
  `category` varchar(30) DEFAULT NULL,
  `notification` text DEFAULT NULL,
  `subdomain` varchar(30) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `category`, `notification`, `subdomain`, `date`) VALUES
(1, 'Announcement', 'this is a test notification for the site.', 'game', '2023-10-01 19:27:27'),
(2, 'Phone Number', 'For your convenience to ensure the safety of your account and successful withdrawal process. Please fill the genuine mobile active number register in your bank account. thanks for your cooperation', 'game', '2023-10-01 19:27:27');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(10) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `ph` int(15) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(50) DEFAULT NULL,
  `pid` int(10) NOT NULL DEFAULT 0,
  `pwd` varchar(50) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `login_time` int(15) NOT NULL DEFAULT 0,
  `type` enum('user','admin','agent') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `ph`, `created_at`, `email`, `pid`, `pwd`, `access_token`, `login_time`, `type`) VALUES
(7, '1', 1, '2023-10-04 18:40:45', '1@1.com', 0, 'U2hhcm93NzIkMHEhM2xkZFlybmI-dTAx', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjE2OTY3NzEyNDEsImV4cCI6MTY5Njc3MjE0MX0.ORmgNTzoa9DveQaxyZYBEMFpznk-EsvqwgTxXa8Evt0', 1696771241, 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game_inplay`
--
ALTER TABLE `game_inplay`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `game`
--
ALTER TABLE `game`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `game_inplay`
--
ALTER TABLE `game_inplay`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
