package jmc.trazaweb;

// Generated 04-may-2015 1:14:29 by Hibernate Tools 3.4.0.CR1

import java.util.List;
import javax.naming.InitialContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.hibernate.SessionFactory;
import static org.hibernate.criterion.Example.create;

/**
 * Home object for domain model class Numeraciones.
 * @see jmc.trazaweb.Numeraciones
 * @author Hibernate Tools
 */
public class NumeracionesHome {

	private static final Log log = LogFactory.getLog(NumeracionesHome.class);

	private final SessionFactory sessionFactory = getSessionFactory();

	protected SessionFactory getSessionFactory() {
		try {
			return (SessionFactory) new InitialContext()
					.lookup("SessionFactory");
		} catch (Exception e) {
			log.error("Could not locate SessionFactory in JNDI", e);
			throw new IllegalStateException(
					"Could not locate SessionFactory in JNDI");
		}
	}

	public void persist(Numeraciones transientInstance) {
		log.debug("persisting Numeraciones instance");
		try {
			sessionFactory.getCurrentSession().persist(transientInstance);
			log.debug("persist successful");
		} catch (RuntimeException re) {
			log.error("persist failed", re);
			throw re;
		}
	}

	public void attachDirty(Numeraciones instance) {
		log.debug("attaching dirty Numeraciones instance");
		try {
			sessionFactory.getCurrentSession().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(Numeraciones instance) {
		log.debug("attaching clean Numeraciones instance");
		try {
			sessionFactory.getCurrentSession().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void delete(Numeraciones persistentInstance) {
		log.debug("deleting Numeraciones instance");
		try {
			sessionFactory.getCurrentSession().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public Numeraciones merge(Numeraciones detachedInstance) {
		log.debug("merging Numeraciones instance");
		try {
			Numeraciones result = (Numeraciones) sessionFactory
					.getCurrentSession().merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public Numeraciones findById(short id) {
		log.debug("getting Numeraciones instance with id: " + id);
		try {
			Numeraciones instance = (Numeraciones) sessionFactory
					.getCurrentSession().get("jmc.trazaweb.Numeraciones", id);
			if (instance == null) {
				log.debug("get successful, no instance found");
			} else {
				log.debug("get successful, instance found");
			}
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List<Numeraciones> findByExample(Numeraciones instance) {
		log.debug("finding Numeraciones instance by example");
		try {
			List<Numeraciones> results = (List<Numeraciones>) sessionFactory
					.getCurrentSession()
					.createCriteria("jmc.trazaweb.Numeraciones")
					.add(create(instance)).list();
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}
}
